import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@patternfly/react-core';
import { useK8sWatchResource, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { Link } from 'react-router-dom';
import { CertificateModel, Certificate } from './crds/Certificate';
import { ResourceTable, ResourceTableRowActions } from './ResourceTable';

interface CertificatesTableProps {
  selectedProject?: string;
}

function getReadyStatus(
  conditions?: Array<{ type: string; status: string }>,
): 'success' | 'danger' | 'warning' {
  const ready = conditions?.find((c) => c.type === 'Ready');
  if (!ready) return 'warning';
  if (ready.status === 'True') return 'success';
  if (ready.status === 'False') return 'danger';
  return 'warning';
}

export const CertificatesTable: React.FC<CertificatesTableProps> = ({ selectedProject }) => {
  const { t } = useTranslation('plugin__console-plugin-template');

  const namespace = selectedProject && selectedProject !== '#ALL_NS#' ? selectedProject : undefined;

  const [items, loaded, loadError] = useK8sWatchResource<Certificate[]>({
    groupVersionKind: CertificateModel,
    namespace,
    isList: true,
  });

  const columns = [
    { title: t('Name'), width: 20 },
    { title: t('Namespace'), width: 15 },
    { title: t('Ready'), width: 10 },
    { title: t('Secret'), width: 15 },
    { title: t('Issuer'), width: 15 },
    { title: t('Expires'), width: 15 },
    { title: t('Actions'), width: 10 },
  ];

  const rows = (items || []).map((obj) => {
    const ns = obj.metadata?.namespace ?? '';
    const name = obj.metadata?.name ?? '';
    const inspectHref = `/cert-manager/inspect/certificates/${ns}/${name}`;
    const readyStatus = getReadyStatus(obj.status?.conditions);

    return {
      cells: [
        <Link key="name" to={inspectHref}>
          {name}
        </Link>,
        ns,
        <Label key="ready" status={readyStatus}>
          {obj.status?.conditions?.find((c) => c.type === 'Ready')?.status ?? t('Unknown')}
        </Label>,
        obj.spec?.secretName ?? '-',
        obj.spec?.issuerRef?.name ?? '-',
        obj.status?.notAfter ? <Timestamp key="expires" timestamp={obj.status.notAfter} /> : '-',
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
      emptyStateTitle={t('No Certificates found')}
      emptyStateBody={t('No Certificate resources are currently available.')}
      selectedProject={selectedProject}
      data-test="certificates-table"
    />
  );
};
