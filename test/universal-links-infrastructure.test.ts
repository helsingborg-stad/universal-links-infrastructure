import * as cdk from 'aws-cdk-lib';
import { Template, Match} from 'aws-cdk-lib/assertions';
import { UniversalLinksInfrastructureStack, UniversialLinksStackProps } from '../lib/universal-links-infrastructure-stack';


const testProps: UniversialLinksStackProps = {
  domain: 'testdomain',
  owner: 'testowner',
  repo: 'testrepo',
  branch: 'master',
  certificateArn: 'arn:aws:acm:us-east-1:12345678901:certificate/1234abcd-aaaa-bbbb-cccc-1234abcdabcd',
};

test('should have bucket with same bucketname as domain', () => {
  const app = new cdk.App();
  const stack = new UniversalLinksInfrastructureStack(app, 'MyTestStack', testProps);
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::S3::Bucket', {
    BucketName: testProps.domain
  });
});

test('should have S3 bucketpolicy', () => {
  const app = new cdk.App();
  const stack = new UniversalLinksInfrastructureStack(app, 'MyTestStack', testProps);
  const template = Template.fromStack(stack);
  
  template.hasResourceProperties('AWS::S3::BucketPolicy', {
    PolicyDocument: Match.anyValue()
  });
});

test('should have CloudFrontOriginAccessIdentity', () => {
  const app = new cdk.App();
  const stack = new UniversalLinksInfrastructureStack(app, 'MyTestStack', testProps);
  const template = Template.fromStack(stack);
    
  template.hasResourceProperties('AWS::CloudFront::CloudFrontOriginAccessIdentity', {});
});

test('should have CloudFront Distribution with context vars domain and arn to certificate', () => {
  const app = new cdk.App();
  const stack = new UniversalLinksInfrastructureStack(app, 'MyTestStack', testProps);
  const template = Template.fromStack(stack);
      
  template.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      Aliases: [
        testProps.domain
      ],
      ViewerCertificate: {
        AcmCertificateArn: testProps.certificateArn,
        MinimumProtocolVersion: Match.anyValue(),
        SslSupportMethod: Match.anyValue()
      }
    },
  });
});

test('should have IAM policy with read write access to S3 bucket', () => {
    const app = new cdk.App();
    const stack = new UniversalLinksInfrastructureStack(app, 'MyTestStack', testProps);
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: Match.anyValue(),
                    Effect: 'Allow',
                    Resource: Match.anyValue()
                },
                {
                    Action: Match.anyValue(),
                    Effect: 'Allow',
                    Resource: Match.anyValue()
                },
                {
                    Action: [
                        's3:GetObject*',
                        's3:GetBucket*',
                        's3:List*',
                        's3:DeleteObject*',
                        's3:PutObject',
                        's3:PutObjectLegalHold',
                        's3:PutObjectRetention',
                        's3:PutObjectTagging',
                        's3:PutObjectVersionTagging',
                        's3:Abort*',
                    ],
                    Effect: 'Allow',
                    Resource: Match.anyValue()
                }
            ]
        }
    });
});

test('should have CodeBuild Project with guthub repo uri as source', () => {
  const app = new cdk.App();
  const stack = new UniversalLinksInfrastructureStack(app, 'MyTestStack', testProps);
  const template = Template.fromStack(stack);
      
  template.hasResourceProperties('AWS::CodeBuild::Project', {
    Source: {
      Location: `https://github.com/${testProps.owner}/${testProps.repo}.git`
    }
  });
});