/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PureComponent } from 'react';

import { changeNavigationState } from 'Store/Navigation';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { CART, CART_EDITING } from 'Component/Header';
import { CUSTOMER_ACCOUNT_OVERLAY_KEY } from 'Component/MyAccountOverlay/MyAccountOverlay.component';
import { toggleOverlayByKey } from 'Store/Overlay';
import { showNotification } from 'Store/Notification';
import { CartDispatcher } from 'Store/Cart';
import { TotalsType } from 'Type/MiniCart';
import { isSignedIn } from 'Util/Auth';
import { history } from 'Route';

import CartOverlay from './CartOverlay.component';

export const mapStateToProps = state => ({
    totals: state.CartReducer.cartTotals,
    guest_checkout: state.ConfigReducer.guest_checkout
});

export const mapDispatchToProps = dispatch => ({
    setNavigationState: stateName => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, stateName)),
    changeHeaderState: state => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    updateTotals: options => CartDispatcher.updateTotals(dispatch, options),
    showOverlay: overlayKey => dispatch(toggleOverlayByKey(overlayKey)),
    showNotification: (type, message) => dispatch(showNotification(type, message))
});

export class CartOverlayContainer extends PureComponent {
    static propTypes = {
        totals: TotalsType.isRequired,
        guest_checkout: PropTypes.bool.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        showOverlay: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired
    };

    state = { isEditing: false };

    containerFunctions = {
        changeHeaderState: this.changeHeaderState.bind(this),
        handleCheckoutClick: this.handleCheckoutClick.bind(this)
    };

    handleCheckoutClick(e) {
        const {
            guest_checkout,
            showOverlay,
            showNotification
        } = this.props;

        e.nativeEvent.stopImmediatePropagation();

        if (guest_checkout || isSignedIn()) { // if guest-checkout is disabled
            history.push({ pathname: '/checkout' });
        }

        // there is no mobile, as cart overlay is not visible here
        showOverlay(CUSTOMER_ACCOUNT_OVERLAY_KEY);
        showNotification('info', __('Please sign-in to complete checkout!'));
    }

    changeHeaderState() {
        const { changeHeaderState, totals: { count = 0 } } = this.props;
        const title = __('%s Items', count || 0);

        changeHeaderState({
            name: CART,
            title,
            onEditClick: () => {
                this.setState({ isEditing: true });
                changeHeaderState({
                    name: CART_EDITING,
                    title,
                    onOkClick: () => this.setState({ isEditing: false }),
                    onCancelClick: () => this.setState({ isEditing: false })
                });
            },
            onCloseClick: () => this.setState({ isEditing: false })
        });
    }

    render() {
        return (
            <CartOverlay
              { ...this.props }
              { ...this.state }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartOverlayContainer);
