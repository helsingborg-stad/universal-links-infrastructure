#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { UniversalLinksInfrastructureStack, UniversialLinksStackProps } from '../lib/universal-links-infrastructure-stack';

const app = new cdk.App();

const inputContexts: UniversialLinksStackProps = {
    domain: app.node.tryGetContext('domain'),
    owner: app.node.tryGetContext('owner'),
    repo: app.node.tryGetContext('repo'),
    branch: app.node.tryGetContext('branch') || 'master',
    certificateArn: app.node.tryGetContext('certificateArn'),
};

const missingInputContexts = [];

for (const input in inputContexts) {
  if (inputContexts[input as keyof UniversialLinksStackProps] === undefined) {
    missingInputContexts.push(input);
  }
}

if (missingInputContexts.length > 0) {
  console.log(`Missing context vars ${missingInputContexts}`);
} else {
  new UniversalLinksInfrastructureStack(app, 'UniversalLinksInfrastructureStack', inputContexts);
}
