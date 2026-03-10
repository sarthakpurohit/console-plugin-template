import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@patternfly/react-core';
import { useK8sWatchResource, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { Link } from 'react-router-dom';
import { PipelineRunModel, PipelineRun } from './crds/Pipelines';
import { ResourceTable, ResourceTableRowActions } from './ResourceTable';

interface PipelineRunsTableProps {
  selectedProject?: string;
}

function getSucceededStatus(
  conditions?: Array<{ type: string; status: string }>,
): 'success' | 'danger' | 'warning' {
  const succeeded = conditions?.find((c) => c.type === 'Succeeded');
  if (!succeeded) return 'warning';
  if (succeeded.status === 'True') return 'success';
  if (succeeded.status === 'False') return 'danger';
  return 'warning';
}

export const PipelineRunsTable: React.FC<PipelineRunsTableProps> = ({ selectedProject }) => {
  const { t } = useTranslation('plugin__console-plugin-template');

  const namespace = selectedProject && selectedProject !== '#ALL_NS#' ? selectedProject : undefined;

  const [items, loaded, loadError] = useK8sWatchResource<PipelineRun[]>({
    groupVersionKind: PipelineRunModel,
    namespace,
    isList: true,
  });

  const columns = [
    { title: t('Name'), width: 25 },
    { title: t('Namespace'), width: 15 },
    { title: t('Succeeded'), width: 15 },
    { title: t('Reason'), width: 15 },
    { title: t('Start Time'), width: 15 },
    { title: t('Age'), width: 10 },
    { title: t('Actions'), width: 5 },
  ];

  const rows = (items || []).map((obj) => {
    const ns = obj.metadata?.namespace ?? '';
    const name = obj.metadata?.name ?? '';
    const inspectHref = `/pipelines/inspect/pipelineruns/${ns}/${name}`;
    const succeededStatus = getSucceededStatus(obj.status?.conditions);
    const succeededCondition = obj.status?.conditions?.find((c) => c.type === 'Succeeded');

    return {
      cells: [
        <Link key="name" to={inspectHref}>
          {name}
        </Link>,
        ns,
        <Label key="succeeded" status={succeededStatus}>
          {succeededCondition?.status ?? t('Unknown')}
        </Label>,
        succeededCondition?.reason ?? '-',
        obj.status?.startTime ? (
          <Timestamp key="startTime" timestamp={obj.status.startTime} />
        ) : (
          '-'
        ),
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
      emptyStateTitle={t('No PipelineRuns found')}
      emptyStateBody={t('No PipelineRun resources are currently available.')}
      selectedProject={selectedProject}
      data-test="pipelineruns-table"
    />
  );
};
