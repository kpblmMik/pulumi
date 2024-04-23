import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Create a new VPC
const vpc = new aws.ec2.Vpc("mik-pulumi-vpc", {
    cidrBlock: "10.0.0.0/16",
});

// Create a public subnet within the VPC
const subnet = new aws.ec2.Subnet("mik-pulumi-subnet", {
    vpcId: vpc.id,
    cidrBlock: "10.0.1.0/24",
    mapPublicIpOnLaunch: true,
});

// Configure the EC2 instance with UserData
const userDataScript = pulumi.interpolate`#!/bin/bash
echo "Hello, World!" > index.html
nohup python -m SimpleHTTPServer 80 &`;


// Create an EC2 instance in the public subnet
const instance = new aws.ec2.Instance("mik-pulumi-instance", {
    instanceType: "t2.micro",
    vpcSecurityGroupIds: [vpc.defaultSecurityGroupId],
    subnetId: subnet.id,
    ami: "ami-0f673487d7e5f89ca",
    userData: userDataScript,
    tags: {
        Name: "podinfo-instance",
    },
});

// Export the public IP address of the EC2 instance
export const instancePublicIp = instance.publicIp;
