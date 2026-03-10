import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState, EmptyStateBody, Alert, AlertVariant, Button } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { useDeleteModal, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { Link } from 'react-router-dom';

interface Column {
  title: string;
  width?: number;
}

interface Row {
  cells: React.ReactNode[];
}

interface ResourceTableProps {
  columns: Column[];
  rows: Row[];
  loading?: boolean;
  error?: string;
  emptyStateTitle?: string;
  emptyStateBody?: string;
  /** When set, fallback empty state body is project-aware. */
  selectedProject?: string;
  'data-test'?: string;
}

interface ResourceTableRowActionsProps {
  resource: K8sResourceCommon;
  inspectHref: string;
}

export const ResourceTableRowActions: React.FC<ResourceTableRowActionsProps> = ({
  resource,
  inspectHref,
}) => {
  const { t } = useTranslation('plugin__console-plugin-template');
  const launchDeleteModal = useDeleteModal(resource);

  return (
    <div className="console-plugin-template__action-buttons">
      <Link to={inspectHref}>
        <Button className="console-plugin-template__action-inspect" variant="primary" size="sm">
          {t('Inspect')}
        </Button>
      </Link>
      <Button
        className="console-plugin-template__action-delete"
        variant="danger"
        size="sm"
        onClick={launchDeleteModal}
      >
        {t('Delete')}
      </Button>
    </div>
  );
};

export const ResourceTable: React.FC<ResourceTableProps> = ({
  columns,
  rows,
  loading = false,
  error,
  emptyStateTitle,
  emptyStateBody,
  selectedProject,
  'data-test': dataTest,
}) => {
  const { t } = useTranslation('plugin__console-plugin-template');

  const defaultEmptyStateBody =
    selectedProject && selectedProject !== '#ALL_NS#'
      ? t('No resources of this type are currently available in project {{project}}.', {
          project: selectedProject,
        })
      : t('No resources of this type are currently available.');

  if (loading) {
    return (
      <div className="console-plugin-template__loader" data-test={`${dataTest}-loading`}>
        <div className="console-plugin-template__loader-dot"></div>
        <div className="console-plugin-template__loader-dot"></div>
        <div className="console-plugin-template__loader-dot"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="console-plugin-template__table-message" data-test={`${dataTest}-error`}>
        <Alert variant={AlertVariant.danger} title={t('Error loading resources')} isInline>
          {error}
        </Alert>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="console-plugin-template__table-message" data-test={`${dataTest}-empty`}>
        <EmptyState
          titleText={emptyStateTitle || t('No resources found')}
          icon={SearchIcon}
          headingLevel="h4"
        >
          <EmptyStateBody>{emptyStateBody ?? defaultEmptyStateBody}</EmptyStateBody>
        </EmptyState>
      </div>
    );
  }

  const totalSpecifiedWidth = columns.reduce((sum, col) => sum + (col.width || 0), 0);
  const hasSpecifiedWidths = totalSpecifiedWidth > 0;
  const defaultWidth = hasSpecifiedWidths ? undefined : 100 / columns.length;

  return (
    <div className="console-plugin-template__resource-table" data-test={dataTest}>
      <div className="console-plugin-template__table-responsive">
        <table
          className="console-plugin-template__table"
          style={{ tableLayout: 'fixed', width: '100%' }}
        >
          <thead>
            <tr>
              {columns.map((column, index) => {
                const width = hasSpecifiedWidths ? `${column.width || 0}%` : `${defaultWidth}%`;
                return (
                  <th
                    key={index}
                    role="columnheader"
                    className="console-plugin-template__table-th"
                    style={{ width }}
                  >
                    {column.title}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="console-plugin-template__table-tr">
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="console-plugin-template__table-td">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
