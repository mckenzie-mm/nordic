import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";

export class EcsNordicCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

  // Add VPC (Virtual Private Cloud)
    const vpc = new cdk.aws_ec2.Vpc(this, "vpc-wwurm", {
      ipAddresses: cdk.aws_ec2.IpAddresses.cidr(
        cdk.aws_ec2.Vpc.DEFAULT_CIDR_RANGE
      ),
      enableDnsHostnames: true,
      enableDnsSupport: true,
      defaultInstanceTenancy: cdk.aws_ec2.DefaultInstanceTenancy.DEFAULT,
      availabilityZones: ['ap-southeast-2a'], // [`${props!.env!.region!}a`],
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 16,
          name: 'ecsWithEc2-mark-wwum',
          subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // Add key pair to access EC2 instance
    const keyPair = ec2.KeyPair.fromKeyPairAttributes(this, 'KeyPair', {
      keyPairName: 'KeyPair2',
      type: ec2.KeyPairType.RSA,
    })

    // Create EC2 cluster instance
     const cluster = new cdk.aws_ecs.Cluster(this, "cluster", {
      clusterName: 'ecsWithEc2Cluster-mark-wwurm',
      vpc: vpc,
      capacity: {
        instanceType: cdk.aws_ec2.InstanceType.of(
          cdk.aws_ec2.InstanceClass.T3A,
          cdk.aws_ec2.InstanceSize.SMALL,
        ),
        keyPair: keyPair,
      },
    });

    // Create Task definition of Containers with a Bridge network
    // with a bridge for the networking
    // Expose instance to public
    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef', {
      networkMode: cdk.aws_ecs.NetworkMode.BRIDGE, 
    });


    // Add backend container
    // 'webapi' is case sensitive - the name must be in lower case letters to work
    const webapi = taskDefinition.addContainer('webapi', { 
      image: ecs.ContainerImage.fromRegistry("snapdragonxc/dotnet-wwurm"),
      memoryLimitMiB: 512,
    });

    webapi.addPortMappings({
      containerPort: 5000,
      hostPort: 5000,
      protocol: ecs.Protocol.TCP,
    });

    // Add frontend container
    const appContainer = taskDefinition.addContainer('AppContainer', {
      image: ecs.ContainerImage.fromRegistry("snapdragonxc/app-wwurm"),
      memoryLimitMiB: 512,
    });

    appContainer.addPortMappings({
      containerPort: 3000,
      hostPort: 80,
      protocol: ecs.Protocol.TCP,
    });

    // Add backend network alias to frontend container
    appContainer.addLink(webapi); 

    // Instantiate an Amazon ECS Service
    const ecsService = new ecs.Ec2Service(this, 'Service-wwurm', {
      cluster,
      taskDefinition
    });

    ecsService.connections.allowFromAnyIpv4(cdk.aws_ec2.Port.allTcp()); 
  }
}
