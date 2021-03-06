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

import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { IMAGE_TYPE, VIDEO_TYPE, PLACEHOLDER_TYPE } from 'Component/ProductGallery/ProductGallery.component';
import media, { PRODUCT_MEDIA } from 'Util/Media';
import Image from 'Component/Image';

import './ProductGalleryAdditionalMedia.style';

export default class ProductGalleryAdditionalMedia extends PureComponent {
    static propTypes = {
        media: PropTypes.shape({
            label: PropTypes.string,
            file: PropTypes.string,
            media_type: PropTypes.string
        }).isRequired,
        index: PropTypes.number.isRequired,
        onActiveImageChange: PropTypes.func.isRequired
    };

    onActiveImageChange = () => {
        const { index, onActiveImageChange } = this.props;
        onActiveImageChange(index);
    };

    renderMedia() {
        const { media: { media_type } } = this.props;

        switch (media_type) {
        case VIDEO_TYPE:
            return this.renderVideo();
        case IMAGE_TYPE:
            return this.renderImage();
        case PLACEHOLDER_TYPE:
            return this.renderPlaceholder();
        default:
            return null;
        }
    }

    renderPlaceholder() {
        return (
            <Image
              ratio="custom"
              mix={ { block: 'ProductGalleryAdditionalMedia' } }
              isPlaceholder
            />
        );
    }

    renderVideo() {
        const {
            media: {
                thumbnail: { url },
                label
            }
        } = this.props;

        return (
            <Image
              ratio="custom"
              src={ url }
              alt={ label }
              mix={ { block: 'ProductGalleryAdditionalMedia' } }
            />
        );
    }

    renderImage() {
        const {
            media: {
                label: alt,
                file
            }
        } = this.props;

        const src = media(file, PRODUCT_MEDIA);

        return (
            <Image
              src={ src }
              alt={ alt }
              ratio="custom"
              mix={ { block: 'ProductGalleryAdditionalMedia' } }
            />
        );
    }

    render() {
        return (
            <button
              block="ProductGalleryAdditionalMedia"
              onClick={ this.onActiveImageChange }
            >
                { this.renderMedia() }
            </button>
        );
    }
}
