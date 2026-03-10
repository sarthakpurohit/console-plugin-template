import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@patternfly/react-core';
import { useK8sWatchResource, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { Link } from 'react-router-dom';
import { CertificateRequestModel, CertificateRequest } from './crds/CertificateRequest';
import { ResourceTable, ResourceTableRowActions } from './ResourceTable';

interface CertificateRequestsTableProps {
  selectedProject?: string;
}

function getConditionStatus(
  conditions: Array<{ type: string; status: string }> | undefined,
  type: string,
): 'success' | 'danger' | 'warning' {
  const cond = conditions?.find((c) => c.type === type);
  if (!cond) return 'warning';
  if (cond.status === 'True') return 'success';
  if (cond.status === 'False') return 'danger';
  return 'warning';
}

export const CertificateRequestsTable: React.FC<CertificateRequestsTableProps> = ({
  selectedProject,
}) => {
  const { t } = useTranslation('plugin__console-plugin-template');

  const namespace = selectedProject && selectedProject !== '#ALL_NS#' ? selectedProject : undefined;

  const [items, loaded, loadError] = useK8sWatchResource<CertificateRequest[]>({
    groupVersionKind: CertificateRequestModel,
    namespace,
    isList: true,
  });

  const columns = [
    { title: t('Name'), width: 25 },
    { title: t('Namespace'), width: 15 },
    { title: t('Approved'), width: 12 },
    { title: t('Ready'), width: 12 },
    { title: t('Issuer'), width: 18 },
    { title: t('Age'), width: 10 },
    { title: t('Actions'), width: 8 },
  ];

  const rows = (items || []).map((obj) => {
    const ns = obj.metadata?.namespace ?? '';
    const name = obj.metadata?.name ?? '';
    const inspectHref = `/cert-manager/inspect/certificaterequests/${ns}/${name}`;
    const conditions = obj.status?.conditions;

    const approvedStatus = getConditionStatus(conditions, 'Approved');
    const approvedCond = conditions?.find((c) => c.type === 'Approved');

    const readyStatus = getConditionStatus(conditions, 'Ready');
    const readyCond = conditions?.find((c) => c.type === 'Ready');

    return {
      cells: [
        <Link key="name" to={inspectHref}>
          {name}
        </Link>,
        ns,
        <Label key="approved" status={approvedStatus}>
          {approvedCond?.status ?? t('Unknown')}
        </Label>,
        <Label key="ready" status={readyStatus}>
          {readyCond?.status ?? t('Unknown')}
        </Label>,
        obj.spec?.issuerRef?.name ?? '-',
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
      emptyStateTitle={t('No Certificate Requests found')}
      emptyStateBody={t('No CertificateRequest resources are currently available.')}
      selectedProject={selectedProject}
      data-test="certificaterequests-table"
    />
  );
};
