import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { Title, Card, CardTitle, CardBody, Spinner } from '@patternfly/react-core';
import { useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';
import { useOperatorDetection, PIPELINES_OPERATOR_INFO } from './hooks/useOperatorDetection';
import { OperatorNotInstalled } from './components/OperatorNotInstalled';
import { PipelinesTable } from './components/PipelinesTable';
import { PipelineRunsTable } from './components/PipelineRunsTable';
import { TasksTable } from './components/TasksTable';
import { TaskRunsTable } from './components/TaskRunsTable';
import { TektonConfigsTable } from './components/TektonConfigsTable';
import './components/cert-manager.css';

export const PipelinesPage: React.FC = () => {
  const { t } = useTranslation('plugin__console-plugin-template');
  const [activeNamespace] = useActiveNamespace();
  const operatorStatus = useOperatorDetection(PIPELINES_OPERATOR_INFO);

  const selectedProject = activeNamespace === '#ALL_NS#' ? '#ALL_NS#' : activeNamespace;

  const pageTitle = t('Red Hat OpenShift Pipelines');

  if (operatorStatus === 'loading') {
    return (
      <>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <div className="console-plugin-template__inspect-page">
          <Spinner size="lg" aria-label={t('Loading...')} />
        </div>
      </>
    );
  }

  if (operatorStatus === 'not-installed') {
    return (
      <>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <div className="console-plugin-template__inspect-page">
          <Title headingLevel="h1" size="xl">
            {pageTitle}
          </Title>
          <OperatorNotInstalled operatorDisplayName={PIPELINES_OPERATOR_INFO.displayName} />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div className="console-plugin-template__inspect-page">
        <Title
          headingLevel="h1"
          size="xl"
          style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}
        >
          {pageTitle}
        </Title>

        <div className="console-plugin-template__dashboard-cards">
          <Card className="console-plugin-template__resource-card">
            <CardTitle>{t('Pipelines')}</CardTitle>
            <CardBody>
              <PipelinesTable selectedProject={selectedProject} />
            </CardBody>
          </Card>

          <Card className="console-plugin-template__resource-card">
            <CardTitle>{t('Pipeline Runs')}</CardTitle>
            <CardBody>
              <PipelineRunsTable selectedProject={selectedProject} />
            </CardBody>
          </Card>

          <Card className="console-plugin-template__resource-card">
            <CardTitle>{t('Tasks')}</CardTitle>
            <CardBody>
              <TasksTable selectedProject={selectedProject} />
            </CardBody>
          </Card>

          <Card className="console-plugin-template__resource-card">
            <CardTitle>{t('Task Runs')}</CardTitle>
            <CardBody>
              <TaskRunsTable selectedProject={selectedProject} />
            </CardBody>
          </Card>

          <Card className="console-plugin-template__resource-card">
            <CardTitle>{t('Tekton Configs')}</CardTitle>
            <CardBody>
              <TektonConfigsTable />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};
