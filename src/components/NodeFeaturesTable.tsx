import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useK8sWatchResource, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { Link } from 'react-router-dom';
import { NodeFeatureModel, NodeFeature } from './crds/Nfd';
import { ResourceTable, ResourceTableRowActions } from './ResourceTable';

interface NodeFeaturesTableProps {
  selectedProject?: string;
}

export const NodeFeaturesTable: React.FC<NodeFeaturesTableProps> = ({ selectedProject }) => {
  const { t } = useTranslation('plugin__console-plugin-template');

  const namespace = selectedProject && selectedProject !== '#ALL_NS#' ? selectedProject : undefined;

  const [items, loaded, loadError] = useK8sWatchResource<NodeFeature[]>({
    groupVersionKind: NodeFeatureModel,
    namespace,
    isList: true,
  });

  const columns = [
    { title: t('Name'), width: 40 },
    { title: t('Namespace'), width: 25 },
    { title: t('Age'), width: 20 },
    { title: t('Actions'), width: 15 },
  ];

  const rows = (items || []).map((obj) => {
    const ns = obj.metadata?.namespace ?? '';
    const name = obj.metadata?.name ?? '';
    const inspectHref = `/nfd/inspect/nodefeatures/${ns}/${name}`;

    return {
      cells: [
        <Link key="name" to={inspectHref}>
          {name}
        </Link>,
        ns,
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
      emptyStateTitle={t('No NodeFeatures found')}
      emptyStateBody={t('No NodeFeature resources are currently available.')}
      selectedProject={selectedProject}
      data-test="nodefeatures-table"
    />
  );
};
