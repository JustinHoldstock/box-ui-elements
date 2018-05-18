/**
 * @flow
 * @file Content Explorer Preview dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import { injectIntl } from 'react-intl';
import cloneDeep from 'lodash/cloneDeep';
import ContentPreview from '../ContentPreview';
import messages from '../messages';
import { TYPE_FILE, CLASS_MODAL_CONTENT_FULL_BLEED, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../constants';
import Cache from '../../util/Cache';
import type { BoxItem, Collection, Token } from '../../flowTypes';
import type { ContentPreviewProps } from '../ContentPreview';

type Props = {
    isOpen: boolean,
    currentCollection: Collection,
    onCancel: Function,
    item: BoxItem,
    token: Token,
    parentElement: HTMLElement,
    appElement: HTMLElement,
    isTouch: boolean,
    onPreview: Function,
    canDownload: boolean,
    cache: Cache,
    apiHost: string,
    appHost: string,
    staticHost: string,
    sharedLink?: string,
    sharedLinkPassword?: string,
    contentPreviewProps: ContentPreviewProps,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    intl: any
};

const PreviewDialog = ({
    item,
    isOpen,
    parentElement,
    appElement,
    token,
    cache,
    currentCollection,
    canDownload,
    onCancel,
    onPreview,
    apiHost,
    appHost,
    staticHost,
    sharedLink,
    sharedLinkPassword,
    contentPreviewProps,
    requestInterceptor,
    responseInterceptor,
    intl
}: Props) => {
    const { items }: Collection = currentCollection;
    const onLoad = (data: any): void => {
        onPreview(cloneDeep(data));
    };

    if (!item || !items) {
        return null;
    }

    const files: BoxItem[] = items.filter(({ type }) => type === TYPE_FILE);
    return (
        <Modal
            isOpen={isOpen}
            parentSelector={() => parentElement}
            portalClassName={`${CLASS_MODAL} be-modal-preview`}
            className={CLASS_MODAL_CONTENT_FULL_BLEED}
            overlayClassName={CLASS_MODAL_OVERLAY}
            contentLabel={intl.formatMessage(messages.preview)}
            onRequestClose={onCancel}
            appElement={appElement}
        >
            <ContentPreview
                {...contentPreviewProps}
                fileId={item.id}
                apiHost={apiHost}
                appHost={appHost}
                staticHost={staticHost}
                cache={cache}
                token={token}
                hasHeader
                autoFocus
                collection={files}
                onLoad={onLoad}
                onClose={onCancel}
                canDownload={canDownload}
                sharedLink={sharedLink}
                sharedLinkPassword={sharedLinkPassword}
                contentPreviewProps={contentPreviewProps}
                requestInterceptor={requestInterceptor}
                responseInterceptor={responseInterceptor}
            />
        </Modal>
    );
};

export default injectIntl(PreviewDialog);
