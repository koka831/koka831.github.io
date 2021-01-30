---
title: 'Install MySQL on EC2'
date: 2019-02-20
categories:
  - memo
tags:
  - AWS
  - installation
  - MySQL
description: procedure memo
---

## install ubuntu mysql on ec2
install `mysql-server` and setup mysql privillege table via `mysql_secure_installation`.

```sh
sudo apt install nginx mysql-server
sudo mysql_secure_installation

```


## step.2 create a new user
create a database and a user for the database with minimum permission.

::: tip
Note: set charset to `UTF8mb4` to store emoji
:::

```sql
sudo mysql -u root -p

CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';

CREATE DATABASE 'database' character set UTF8mb4 collate utf8mb4_bin;

GRANT ALL PRIVILEGES ON database.* TO 'username'@'localhost' WITH GRANT OPTION;
```

## step.3 install php

```sh
sudo apt install php-curl php-gd php-mbstring php-xml php-xmlrpc php-soap php-intl php-zip
```

## step.4 download wordpress

```
cd /tmp
curl -O https://wordpress.org/latest.tar.gz
mv wp-config-sample.php wp-config.php

## open the link below to generate salt
chrome https://api.wordpress.org/secret-key/1.1/salt/
```

## step.5 setup nginx
- default.conf
- php-fpm unix domain socket


## ref
https://stackoverflow.com/questions/25774975/unable-to-start-php-fpm-cannot-get-uid-for-user-apache
