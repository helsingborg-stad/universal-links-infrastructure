<!-- SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

<p>
  <a href="https://github.com/helsingborg-stad/universal-links-infrastructure">
    <img src="images/hbg-github-logo-combo.png" alt="Logo" width="300">
  </a>
</p>
<h3>Universal links infrastructure</h3>
<p>
  AWS CDK infrastructure for universal links.
  <br />
  <a href="https://github.com/helsingborg-stad/universal-links-infrastructure/issues">Report Bug</a>
  ·
  <a href="https://github.com/helsingborg-stad/universal-links-infrastructure/issues">Request Feature</a>
</p>

## About
This infrastructure will set up a S3 bucket with Cloudfront for serving universal links.  
Link files will be fetched from a separate repository provided in context vars.

## Table of Contents
- [About](#about)
- [Table of Contents](#table-of-contents)
  - [Built With](#built-with)
  - [Prerequisites](#prerequisites)
  - [Do first](#do-first)
    - [Github Personal access token](#github-personal-access-token)
    - [ACM certificate](#acm-certificate)
  - [Installation](#installation)
  - [Deploy](#deploy)
  - [Context variables](#context-variables)
  - [Universal Links repository structure](#universal-links-repository-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

### Built With

* [Serverless Framework](https://www.serverless.com/)
* [AWS](https://aws.amazon.com)


### Prerequisites

- AWS CDK v2
- AWS CLI
- AWS Account
- NodeJS
- NPM
- AWS ACM certificate created in us-east-1 region.
- Github access key
- A domain name with access to DNS


### Do first
#### Github Personal access token
You will need to create an github `Personal access token` with access to the universal links repository with the permissions.  
- repo
- admin:repo_hhok

Save this key as a secret with the name `GithubAccessToken`.
```sh
aws secretsmanager create-secret --name GithubAccessToken --secret-string gpl_personalAccessToken
```

#### ACM certificate
You will need to create a AWS ACM certificate for the domain created in us-east-1 region on your AWS account.
https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html  
Use the ARN for the certificate as a context variable when deploying this infrastructure.


### Installation


Clone repo
```sh
git clone git@github.com:helsingborg-stad/universal-links-infrastructure.git
```

Install shared npm packages
```sh
cd universal-links-infrastructure
npm install
```

### Deploy
Deploy using supplied context variables.
```sh
cdk -c domain=links-links.example.com -c owner="github-owner" -c repo="universal-links-reporitory-name" -c certificateArn=arn:aws:acm:us-east-1:12345678901:certificate/1234abcdef-aaaa-bbbb-cccc-1234abcdef deploy
```

### Context variables
| Context parameter name | Description                                                                  | Required | Default |
|------------------------|------------------------------------------------------------------------------|----------|---------|
| domain                 | Domain name for universal link host                                          | true     |         |
| owner                  | Repository owner for repo containing the universal link files.               | true     |         |
| repo                   | Repository name for repo containing the universal link files.                | true     |         |
| branch                 | Branch name of repo that will be located on S3.                              | false    | master  |
| certificateArn         | Arn to a premade ACM certificate created for the domain in region us-east-1. | true     |         |



### Universal Links repository structure
Universal link files are served from a different repository as this is only the infrastructure code.  
The repo should contain a folder named `files`

ex.
```
root
│   README.md   
│
└───files
│   │
│   └───.well-known
|       |
│       │   apple-app-site-association
```

Everything below the `files` folder will be synced to the root of the serving domain.  
ex. with above repository.
```
https://links.example.com/.well-known/apple-app-site-association
```

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## License

Distributed under the [MIT License][license-url].


## Acknowledgements

- [othneildrew Best README Template](https://github.com/othneildrew/Best-README-Template)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/helsingborg-stad/universal-links-infrastructure.svg?style=flat-square
[contributors-url]: https://github.com/helsingborg-stad/universal-links-infrastructure/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/helsingborg-stad/universal-links-infrastructure.svg?style=flat-square
[forks-url]: https://github.com/helsingborg-stad/universal-links-infrastructure/network/members
[stars-shield]: https://img.shields.io/github/stars/helsingborg-stad/universal-links-infrastructure.svg?style=flat-square
[stars-url]: https://github.com/helsingborg-stad/universal-links-infrastructure/stargazers
[issues-shield]: https://img.shields.io/github/issues/helsingborg-stad/universal-links-infrastructure.svg?style=flat-square
[issues-url]: https://github.com/helsingborg-stad/universal-links-infrastructure/issues
[license-shield]: https://img.shields.io/github/license/helsingborg-stad/universal-links-infrastructure.svg?style=flat-square
[license-url]: https://raw.githubusercontent.com/helsingborg-stad/universal-links-infrastructure/master/LICENSE
