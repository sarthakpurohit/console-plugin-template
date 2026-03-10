import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useK8sWatchResource, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { Link } from 'react-router-dom';
import { TaskModel, Task } from './crds/Pipelines';
import { ResourceTable, ResourceTableRowActions } from './ResourceTable';

interface TasksTableProps {
  selectedProject?: string;
}

export const TasksTable: React.FC<TasksTableProps> = ({ selectedProject }) => {
  const { t } = useTranslation('plugin__console-plugin-template');

  const namespace = selectedProject && selectedProject !== '#ALL_NS#' ? selectedProject : undefined;

  const [items, loaded, loadError] = useK8sWatchResource<Task[]>({
    groupVersionKind: TaskModel,
    namespace,
    isList: true,
  });

  const columns = [
    { title: t('Name'), width: 45 },
    { title: t('Namespace'), width: 30 },
    { title: t('Age'), width: 15 },
    { title: t('Actions'), width: 10 },
  ];

  const rows = (items || []).map((obj) => {
    const ns = obj.metadata?.namespace ?? '';
    const name = obj.metadata?.name ?? '';
    const inspectHref = `/pipelines/inspect/tasks/${ns}/${name}`;

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
      emptyStateTitle={t('No Tasks found')}
      emptyStateBody={t('No Task resources are currently available.')}
      selectedProject={selectedProject}
      data-test="tasks-table"
    />
  );
};
