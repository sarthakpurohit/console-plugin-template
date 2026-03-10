import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@patternfly/react-core';
import { useK8sWatchResource, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { Link } from 'react-router-dom';
import { NodeFeatureDiscoveryModel, NodeFeatureDiscovery } from './crds/Nfd';
import { ResourceTable, ResourceTableRowActions } from './ResourceTable';

interface NodeFeatureDiscoveriesTableProps {
  selectedProject?: string;
}

function getAvailableStatus(
  conditions?: Array<{ type: string; status: string }>,
): 'success' | 'danger' | 'warning' {
  const available = conditions?.find((c) => c.type === 'Available');
  if (!available) return 'warning';
  if (available.status === 'True') return 'success';
  if (available.status === 'False') return 'danger';
  return 'warning';
}

export const NodeFeatureDiscoveriesTable: React.FC<NodeFeatureDiscoveriesTableProps> = ({
  selectedProject,
}) => {
  const { t } = useTranslation('plugin__console-plugin-template');

  const namespace = selectedProject && selectedProject !== '#ALL_NS#' ? selectedProject : undefined;

  const [items, loaded, loadError] = useK8sWatchResource<NodeFeatureDiscovery[]>({
    groupVersionKind: NodeFeatureDiscoveryModel,
    namespace,
    isList: true,
  });

  const columns = [
    { title: t('Name'), width: 30 },
    { title: t('Namespace'), width: 20 },
    { title: t('Available'), width: 20 },
    { title: t('Age'), width: 15 },
    { title: t('Actions'), width: 15 },
  ];

  const rows = (items || []).map((obj) => {
    const ns = obj.metadata?.namespace ?? '';
    const name = obj.metadata?.name ?? '';
    const inspectHref = `/nfd/inspect/nodefeaturediscoveries/${ns}/${name}`;
    const availableStatus = getAvailableStatus(obj.status?.conditions);

    return {
      cells: [
        <Link key="name" to={inspectHref}>
          {name}
        </Link>,
        ns,
        <Label key="available" status={availableStatus}>
          {obj.status?.conditions?.find((c) => c.type === 'Available')?.status ?? t('Unknown')}
        </Label>,
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
      emptyStateTitle={t('No NodeFeatureDiscoveries found')}
      emptyStateBody={t('No NodeFeatureDiscovery resources are currently available.')}
      selectedProject={selectedProject}
      data-test="nodefeaturediscoveries-table"
    />
  );
};
