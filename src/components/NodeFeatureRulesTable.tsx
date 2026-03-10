import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useK8sWatchResource, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { Link } from 'react-router-dom';
import { NodeFeatureRuleModel, NodeFeatureRule } from './crds/Nfd';
import { ResourceTable, ResourceTableRowActions } from './ResourceTable';

export const NodeFeatureRulesTable: React.FC = () => {
  const { t } = useTranslation('plugin__console-plugin-template');

  const [items, loaded, loadError] = useK8sWatchResource<NodeFeatureRule[]>({
    groupVersionKind: NodeFeatureRuleModel,
    isList: true,
  });

  const columns = [
    { title: t('Name'), width: 50 },
    { title: t('Age'), width: 30 },
    { title: t('Actions'), width: 20 },
  ];

  const rows = (items || []).map((obj) => {
    const name = obj.metadata?.name ?? '';
    const inspectHref = `/nfd/inspect/nodefeaturerules/${name}`;

    return {
      cells: [
        <Link key="name" to={inspectHref}>
          {name}
        </Link>,
        obj.metadata?.creationTimestamp ? (
          <Timestamp key="age" timestamp={obj.metadata.creationTimestamp} />
        ) : (
          '-'
        ),
        <ResourceTableRowActions key="actions" resource={obj} inspectHref={inspectHref} />,
      ],
    };
  });

  return (
    <ResourceTable
      columns={columns}
      rows={rows}
      loading={!loaded && !loadError}
      error={loadError?.message}
      emptyStateTitle={t('No NodeFeatureRules found')}
      emptyStateBody={t('No NodeFeatureRule resources are currently available.')}
      data-test="nodefeaturerules-table"
    />
  );
};
