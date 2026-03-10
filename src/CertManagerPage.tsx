import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { Title, Card, CardTitle, CardBody, Spinner } from '@patternfly/react-core';
import { useActiveNamespace } from '@openshift-console/dynamic-plugin-sdk';
import { useOperatorDetection, CERT_MANAGER_OPERATOR_INFO } from './hooks/useOperatorDetection';
import { OperatorNotInstalled } from './components/OperatorNotInstalled';
import { CertificatesTable } from './components/CertificatesTable';
import { CertificateRequestsTable } from './components/CertificateRequestsTable';
import { IssuersTable } from './components/IssuersTable';
import { ClusterIssuersTable } from './components/ClusterIssuersTable';
import './components/cert-manager.css';

export const CertManagerPage: React.FC = () => {
  const { t } = useTranslation('plugin__console-plugin-template');
  const [activeNamespace] = useActiveNamespace();
  const operatorStatus = useOperatorDetection(CERT_MANAGER_OPERATOR_INFO);

  const selectedProject = activeNamespace === '#ALL_NS#' ? '#ALL_NS#' : activeNamespace;

  const pageTitle = t('cert-manager');

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
          <OperatorNotInstalled operatorDisplayName={CERT_MANAGER_OPERATOR_INFO.displayName} />
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
            <CardTitle>{t('Certificates')}</CardTitle>
            <CardBody>
              <CertificatesTable selectedProject={selectedProject} />
            </CardBody>
          </Card>

          <Card className="console-plugin-template__resource-card">
            <CardTitle>{t('Certificate Requests')}</CardTitle>
            <CardBody>
              <CertificateRequestsTable selectedProject={selectedProject} />
            </CardBody>
          </Card>

          <Card className="console-plugin-template__resource-card">
            <CardTitle>{t('Issuers')}</CardTitle>
            <CardBody>
              <IssuersTable selectedProject={selectedProject} />
            </CardBody>
          </Card>

          <Card className="console-plugin-template__resource-card">
            <CardTitle>{t('ClusterIssuers')}</CardTitle>
            <CardBody>
              <ClusterIssuersTable />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};
