import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { Title, Card, CardTitle, CardBody, Spinner } from '@patternfly/react-core';
import { useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';
import { useOperatorDetection, NFD_OPERATOR_INFO } from './hooks/useOperatorDetection';
import { OperatorNotInstalled } from './components/OperatorNotInstalled';
import { NodeFeatureDiscoveriesTable } from './components/NodeFeatureDiscoveriesTable';
import { NodeFeatureRulesTable } from './components/NodeFeatureRulesTable';
import { NodeFeaturesTable } from './components/NodeFeaturesTable';
import './components/cert-manager.css';

export const NfdPage: React.FC = () => {
  const { t } = useTranslation('plugin__console-plugin-template');
  const [activeNamespace] = useActiveNamespace();
  const operatorStatus = useOperatorDetection(NFD_OPERATOR_INFO);

  const selectedProject = activeNamespace === '#ALL_NS#' ? '#ALL_NS#' : activeNamespace;

  const pageTitle = t('Node Feature Discovery');

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
          <OperatorNotInstalled operatorDisplayName={NFD_OPERATOR_INFO.displayName} />
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
            <CardTitle>{t('NodeFeatureDiscoveries')}</CardTitle>
            <CardBody>
              <NodeFeatureDiscoveriesTable selectedProject={selectedProject} />
            </CardBody>
          </Card>

          <Card className="console-plugin-template__resource-card">
            <CardTitle>{t('NodeFeatureRules')}</CardTitle>
            <CardBody>
              <NodeFeatureRulesTable />
            </CardBody>
          </Card>

          <Card className="console-plugin-template__resource-card">
            <CardTitle>{t('NodeFeatures')}</CardTitle>
            <CardBody>
              <NodeFeaturesTable selectedProject={selectedProject} />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};
