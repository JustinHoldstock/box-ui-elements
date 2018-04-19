/**
 * @flow
 * @file Preview sidebar component
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import TabView from 'box-react-ui/lib/components/tab-view/TabView';
import Tab from 'box-react-ui/lib/components/tab-view/Tab';
import DetailsSidebar from './DetailsSidebar';
import ActivityFeed from './ActivityFeed/activity-feed/ActivityFeed';
import { hasSkills as hasSkillsData } from './Skills/skillUtils';
import messages from '../messages';
import type { AccessStats, BoxItem, FileVersions, Errors } from '../../flowTypes';
import './Sidebar.scss';

type Props = {
    file: BoxItem,
    getPreviewer: Function,
    hasTitle: boolean,
    hasSkills: boolean,
    hasProperties: boolean,
    hasMetadata: boolean,
    hasNotices: boolean,
    hasAccessStats: boolean,
    hasClassification: boolean,
    hasActivityFeed: boolean,
    hasVersions: boolean,
    rootElement: HTMLElement,
    appElement: HTMLElement,
    onAccessStatsClick?: Function,
    onInteraction: Function,
    onDescriptionChange: Function,
    onClassificationClick?: Function,
    onVersionHistoryClick?: Function,
    descriptionTextareaProps: Object,
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskUpdate?: Function,
    onTaskAssignmentUpdate?: Function,
    getCollaboratorWithQuery?: Function,
    intl: any,
    versions?: FileVersions,
    accessStats?: AccessStats,
    fileError?: Errors,
    versionError?: Errors,
};

const currentUser = { name: 'Blue Ivy Carter', id: '2' };
const feedState = [
    {
        createdAt: Date.now(),
        id: '1838475',
        versionNumber: 2,
        createdBy: { name: 'Beyonce', id: 4 },
        action: 'upload',
        type: 'file_version'
    },
    {
        createdAt: Date.now(),
        id: '123123',
        taggedMessage: 'I got 99 problems but @[123:Shawn Carter] ain\'t one!',
        createdBy: { name: 'Kanye West', id: 2 },
        type: 'comment'
    },
    {
        createdAt: Date.now(),
        id: '456456',
        taggedMessage: '@[456:Rihanna] You used to call me on my cell phone',
        createdBy: { name: 'Aubrey Graham', id: 1 },
        type: 'comment'
    },
    {
        createdAt: Date.now(),
        id: '789789',
        taggedMessage: '@[789:Abel Tesfaye] It ain\'t me',
        createdBy: { name: 'Selena Gomez', id: 3 },
        type: 'comment'
    },
    {
        createdAt: Date.now(),
        id: '1489532',
        versionNumber: 1,
        createdBy: { name: 'Beyonce', id: 4 },
        action: 'upload',
        type: 'file_version'
    }
];

const Sidebar = ({
    file,
    getPreviewer,
    hasTitle,
    hasSkills,
    hasProperties,
    hasMetadata,
    hasNotices,
    hasAccessStats,
    hasClassification,
    hasActivityFeed,
    hasVersions,
    rootElement,
    appElement,
    onAccessStatsClick,
    onInteraction,
    onDescriptionChange,
    intl,
    onClassificationClick,
    onVersionHistoryClick,
    onCommentCreate,
    onCommentDelete,
    onTaskCreate,
    onTaskDelete,
    onTaskUpdate,
    onTaskAssignmentUpdate,
    getCollaboratorWithQuery,
    versions,
    accessStats,
    fileError,
    versionError
}: Props) => {
    const shouldShowSkills = hasSkills && hasSkillsData(file);

    const Details = (
        <DetailsSidebar
            file={file}
            getPreviewer={getPreviewer}
            hasTitle={hasTitle}
            hasSkills={shouldShowSkills}
            hasProperties={hasProperties}
            hasMetadata={hasMetadata}
            hasNotices={hasNotices}
            hasAccessStats={hasAccessStats}
            hasClassification={hasClassification}
            hasVersions={hasVersions}
            appElement={appElement}
            rootElement={rootElement}
            onAccessStatsClick={onAccessStatsClick}
            onInteraction={onInteraction}
            onClassificationClick={onClassificationClick}
            onDescriptionChange={onDescriptionChange}
            onVersionHistoryClick={onVersionHistoryClick}
            versions={versions}
            accessStats={accessStats}
            fileError={fileError}
            versionError={versionError}
        />
    );

    if (!hasActivityFeed) {
        return Details;
    }

    const inputState = {
        currentUser,
        approverSelectorContacts: [],
        mentionSelectorContacts: []
    };

    const handlers = {
        comments: {
            create: file.permissions.can_comment ? onCommentCreate : null,
            delete: file.permissions.can_comment ? onCommentDelete : null
        },
        tasks: {
            // Figure out what permissions are needed for task actions
            create: file.permissions.can_comment ? onTaskCreate : null,
            delete: file.permissions.can_comment ? onTaskDelete : null,
            edit: file.permissions.can_comment ? onTaskUpdate : null,
            onTaskAssignmentUpdate
        },
        contacts: {
            // Figure out what permissions are needed for @mentions
            getApproverWithQuery: file.permissions.can_comment ? getCollaboratorWithQuery : null,
            getMentionWithQuery: file.permissions.can_comment ? getCollaboratorWithQuery : null
        },
        versions: {
            // Unsure if this is supposed to trigger the version history popup
            // or a different version popup
            info: onVersionHistoryClick
        }
    };

    const ActivityFeedSidebar = (
        <ActivityFeed
            feedState={feedState}
            inputState={inputState}
            handlers={handlers}
        />
    );

    return (
        <TabView defaultSelectedIndex={shouldShowSkills ? 0 : 1}>
            <Tab title={intl.formatMessage(messages.sidebarDetailsTitle)}>{Details}</Tab>
            <Tab title='Activity'>{ActivityFeedSidebar}</Tab>
        </TabView>
    );
};

export default injectIntl(Sidebar);
