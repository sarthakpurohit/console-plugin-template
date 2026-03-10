import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@patternfly/react-core';
import { useK8sWatchResource, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { Link } from 'react-router-dom';
import { ClusterIssuerModel, ClusterIssuer } from './crds/Issuer';
import { ResourceTable, ResourceTableRowActions } from './ResourceTable';

function getReadyStatus(
  conditions?: Array<{ type: string; status: string }>,
): 'success' | 'danger' | 'warning' {
  const ready = conditions?.find((c) => c.type === 'Ready');
  if (!ready) return 'warning';
  if (ready.status === 'True') return 'success';
  if (ready.status === 'False') return 'danger';
  return 'warning';
}

export const ClusterIssuersTable: React.FC = () => {
  const { t } = useTranslation('plugin__console-plugin-template');

  const [items, loaded, loadError] = useK8sWatchResource<ClusterIssuer[]>({
    groupVersionKind: ClusterIssuerModel,
    isList: true,
  });

  const columns = [
    { title: t('Name'), width: 40 },
    { title: t('Ready'), width: 30 },
    { title: t('Age'), width: 20 },
    { title: t('Actions'), width: 10 },
  ];

  const rows = (items || []).map((obj) => {
    const name = obj.metadata?.name ?? '';
    const inspectHref = `/cert-manager/inspect/clusterissuers/${name}`;
    const readyStatus = getReadyStatus(obj.status?.conditions);

    return {
      cells: [
        <Link key="name" to={inspectHref}>
          {name}
        </Link>,
        <Label key="ready" status={readyStatus}>
          {obj.status?.conditions?.find((c) => c.type === 'Ready')?.status ?? t('Unknown')}
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
      emptyStateTitle={t('No ClusterIssuers found')}
      emptyStateBody={t('No ClusterIssuer resources are currently available.')}
      data-test="clusterissuers-table"
    />
  );
};
