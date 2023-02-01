import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as amplify from "aws-cdk-lib/aws-amplify";
import * as sm from "aws-cdk-lib/aws-secretsmanager";

export class CdkAmplifyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const secret = sm.Secret.fromSecretAttributes(this, "ImportedSecret", {
      secretCompleteArn: process.env["MRG_GITHUB_SECRET_ARN"],
    });

    const app = new amplify.CfnApp(this, "MyAmplifyApp", {
      name: (process?.env["MRG_PROJECT_NAME"] || "gretkzy-admin") + "-amplify",
      repository: process.env["MRG_GITHUB_REPO"],
      accessToken: secret.secretValueFromJson("orgGithubToken").unsafeUnwrap(),
    });

    // const branchProd = new amplify.CfnBranch(this, "prod", {
    //   appId: app.attrAppId,
    //   branchName: "main",
    //   stage: "PRODUCTION",
    // });

    // const branchStaging = new amplify.CfnBranch(this, "staging", {
    //   appId: app.attrAppId,
    //   branchName: "staging",
    //   stage: "STAGING",
    // });

    const branchDevelopment = new amplify.CfnBranch(this, "dev", {
      appId: app.attrAppId,
      branchName: "development",
      stage: "DEVELOPMENT",
    });

    // const cfnBranch = new amplify.CfnBranch(this, "MyCfnBranch", {
    //   appId: app.attrAppId,
    //   branchName: "main",

    //   buildSpec: "buildSpec",
    //   description: "description",
    //   enableAutoBuild: false,
    //   enablePerformanceMode: false,
    //   enablePullRequestPreview: false,
    //   environmentVariables: [
    //     {
    //       name: "name",
    //       value: "value",
    //     },
    //   ],
    //   framework: "framework",
    //   pullRequestEnvironmentName: "pr-env",
    //   stage: "stage",
    //   tags: [
    //     {
    //       key: "key",
    //       value: "value",
    //     },
    //   ],
    // });

    // const cfnDomain = new amplify.CfnDomain(this, "MyCfnDomain", {
    //   appId: "appId",
    //   domainName: "domainName",
    //   subDomainSettings: [
    //     {
    //       branchName: "branchName",
    //       prefix: "prefix",
    //     },
    //   ],

    //   // the properties below are optional
    //   autoSubDomainCreationPatterns: ["autoSubDomainCreationPatterns"],
    //   autoSubDomainIamRole: "autoSubDomainIamRole",
    //   enableAutoSubDomain: false,
    // });
  }
}
