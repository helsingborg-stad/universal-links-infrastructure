import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as S3 } from 'aws-cdk-lib';
import { aws_secretsmanager as SecretsManager} from 'aws-cdk-lib';
import { aws_codebuild as CodeBuild } from 'aws-cdk-lib';
import { aws_cloudfront as CloudFront } from 'aws-cdk-lib';
import { aws_cloudfront_origins as CloudfrontOrigins } from 'aws-cdk-lib';
import { aws_certificatemanager as CertificateManager} from 'aws-cdk-lib';

export interface UniversialLinksStackProps extends StackProps {
  domain: string;
  owner: string;
  repo: string;
  branch: string;
  certificateArn: string;
}

export class UniversalLinksInfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: UniversialLinksStackProps) {
    super(scope, id, props);

    props?.branch;

    const universialLinksBucket = new S3.Bucket(this, 'UniversialLinksBucket', {
      publicReadAccess: true,
      bucketName: props?.domain,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html'
    });

    const certificate = CertificateManager.Certificate.fromCertificateArn(this, 'UniversialLinksCertificate', props?.certificateArn as string);

    new CloudFront.Distribution(this, 'UniversialLinksDistibution', {
      defaultBehavior: { 
        origin: new CloudfrontOrigins.S3Origin(universialLinksBucket),
        cachePolicy: CloudFront.CachePolicy.CACHING_DISABLED
      },
      domainNames: [ props?.domain as string ],
      certificate: certificate,
    });
    
    const gitHubSource = CodeBuild.Source.gitHub({
      owner: props?.owner as string,
      repo: props?.repo as string,
      webhookFilters: [
        CodeBuild.FilterGroup
          .inEventOf(CodeBuild.EventAction.PUSH)
          .andBranchIs(props?.branch as string)
      ],
    });

    const token = SecretsManager.Secret.fromSecretNameV2(this, 'SecretFromName', 'GithubAccessToken');

    const credentials = new CodeBuild.GitHubSourceCredentials(this, 'GitHubCredentials', {
      accessToken: token.secretValue
    });

    const codeBuildProject = new CodeBuild.Project(this, 'UniversialLinksProject', {
      environment: {
        buildImage: CodeBuild.LinuxBuildImage.AMAZON_LINUX_2_3
      },
      source: gitHubSource,
      buildSpec: CodeBuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
               `aws s3 sync ./files s3://${props?.domain} --delete`
            ],
          },
        },
      }),
    });
    
    universialLinksBucket.grantReadWrite(codeBuildProject);
  }
}
