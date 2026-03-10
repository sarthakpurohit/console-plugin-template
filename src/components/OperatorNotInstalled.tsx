import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

interface OperatorNotInstalledProps {
  operatorDisplayName: string;
}

export const OperatorNotInstalled: React.FC<OperatorNotInstalledProps> = ({
  operatorDisplayName,
}) => {
  const { t } = useTranslation('plugin__console-plugin-template');

  return (
    <EmptyState titleText={t('Operator not installed')} icon={SearchIcon} headingLevel="h2">
      <EmptyStateBody>
        {t('{{operatorName}} is not installed in this cluster.', {
          operatorName: operatorDisplayName,
        })}
      </EmptyStateBody>
    </EmptyState>
  );
};
