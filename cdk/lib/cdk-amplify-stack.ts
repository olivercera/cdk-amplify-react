import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as amplify from "aws-cdk-lib/aws-amplify";
import * as sm from "aws-cdk-lib/aws-secretsmanager";

export class CdkAmplifyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const secret = sm.Secret.fromSecretAttributes(this, "ImportedSecret", {
      secretCompleteArn: process.env["MRG_GITHUB_SECRET_ARN"],
    });

    const app = new amplify.CfnApp(this, "AmplifyApp", {
      name: (process?.env["MRG_PROJECT_NAME"] || "gretkzy-admin") + "-amplify",
      repository: process.env["MRG_GITHUB_REPO"],
      accessToken: secret.secretValueFromJson("orgGithubToken").unsafeUnwrap(),
      environmentVariables: [
        {
          name: "REACT_APP_OKTA_ISSUER",
          value: process.env["REACT_APP_OKTA_ISSUER"] || "TBD",
        },
        {
          name: "REACT_APP_OKTA_CLIENT_ID",
          value: process.env["REACT_APP_OKTA_CLIENT_ID"] || "TBD",
        },
      ],
      customRules: [
        {
          source: "/<*>",
          target: "/index.html",
          status: "404-200",
        },
        {
          source:
            "</^[^.]+$|.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|map|json)$)([^.]+$)/>",
          target: "/index.html",
          status: "200",
        },
      ],
    });

    const branchProd = new amplify.CfnBranch(this, "prod", {
      appId: app.attrAppId,
      branchName: "main",
      stage: "PRODUCTION",
      environmentVariables: [
        {
          name: "REACT_APP_OKTA_DEV_MODE",
          value: "true",
        },
      ],
    });

    const branchStaging = new amplify.CfnBranch(this, "staging", {
      appId: app.attrAppId,
      branchName: "staging",
      stage: "DEVELOPMENT",
      environmentVariables: [
        {
          name: "REACT_APP_OKTA_DEV_MODE",
          value: "false",
        },
      ],
    });

    const branchDevelopment = new amplify.CfnBranch(this, "dev", {
      appId: app.attrAppId,
      branchName: "development",
      stage: "DEVELOPMENT",
      environmentVariables: [
        {
          name: "REACT_APP_OKTA_DEV_MODE",
          value: "false",
        },
      ],
    });

    const cfnDomain = new amplify.CfnDomain(this, "prod-domain", {
      appId: app.attrAppId,
      domainName: process.env["MRG_PROD_DOMAIN"] || "",

      subDomainSettings: [
        {
          branchName: branchProd.branchName,
          prefix: "",
        },
        {
          branchName: branchStaging.branchName,
          prefix: process.env["MRG_TESTING_SUBDOMAIN"] || "",
        },
        {
          branchName: branchDevelopment.branchName,
          prefix: process.env["MRG_DEV_SUBDOMAIN"] || "",
        },
      ],
    });
  }
}
