import React from "react";
import Layout from "../components/layout";
import styles from "./index.module.scss";

import { faTwitterSquare, faGithubSquare } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icon from "../components/Icon";

const Index: React.FC = () =>  {
  return (
    <Layout>
      <div className={styles.container}>
        <Profile />
        <Skills />
        <Projects />
        <Contact />
      </div>
    </Layout>
  );
};

const Profile: React.FC = () => {
  return (
    <section
      itemScope
      itemType="http://microformats.org/profile/hcard"
      className={styles.profile_container}
      aria-label="Profile"
    >
      <div className={styles.left}>
        <Icon />
      </div>
      <div itemProp="fn" className={styles.profile__main}>
        <h2 itemProp="n">Koka</h2>
        <p itemProp="role">Software Engineer</p>
        <p>Bachelor of Engineering @<a target="_blank" rel="noopener noreferrer" href="https://www.ynu.ac.jp/">YNU</a></p>
      </div>
    </section>
  );
};

const Skills: React.FC = () => {
  return (
    <section className={styles.skills_container}>
      <h1>Skills</h1>
      <ul className={styles.skills} aria-label="Skills">
        <li>
          <h3>Rust</h3>
          some personal experiences in Low-Layer Programming like <a target="_blank" rel="noopener noreferrer" href="https://github.com/koka831/runix">Hobby Kernel</a>, 
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/koka831/marmoset">Interpreter</a>, interested in boot loading sequence and Linux kernel especially memory mapping.
          <br />
          <br />
          practices <a target="_blank" rel="noopener noreferrer" href="https://github.com/koka831/algorithm">algorithms</a> (AtCoder Highest: 1201).<br />
        </li>
        <li>
          <h3>Ruby</h3>
          have some experiences with Ruby on Rails, devise token auth and capistrano.<br />
          I usually use Rails for APIs and provide them with token authentication by devise.
        </li>
        <li>
          <h3>TypeScript</h3>
          - React<br />
          - Next.js<br />
          - redux-toolkit<br />
          - (<a href="https://www.prisma.io/">Prisma</a>)
        </li>
        <li>
          <h3>Python</h3>
          - NLP, Self-Attention model + Encoder-Decoder<br />
          - time-series data analysis<br />
          - wrote some contents for <a target="_blank" rel="noreferrer noopener" href="https://tracks.run/">track</a><br />
        </li>
        <li>
          <h3>Tools</h3>
          - Arch Linux + i3wm + tmux + zsh + Neovim<br />
          - AWS: ALB + EC2, S3, ECS + ECR, SES, SNS, CloudWatch<br />
          - Swagger<br />
          - Terraform<br />
        </li>
        <li>
          <h3>Interests</h3>
          - Oil Painting<br />
          - Tea<br />
        </li>
      </ul>
    </section>
  );
};

const Projects: React.FC = () => {
  return (
    <section className={styles.projects_container}>
      <h2>Side Projects</h2>
      <ul>
        <li>
          <h3>Automatic-control system for UAV(Unmanned Aerial Vehicle, a.k.a Drone)</h3>
          - written in C(C++)<br />
          - in-time object recognition in movies from UAVs<br />
        </li>
        <li>
          <h3>Air Conditioner Controller using Infrared Sensor with Raspberry Pi Zero</h3>
          - repaired a broken controller with SIR-34ST3F IR device<br />
          - written in MicroPython<br />
        </li>
        <li>
          <h3>Runix, a Hobby Kernel in Rust</h3>
          - boots on qemu<br />
          - accepts keyboard input<br />
          - supports 64bits mode and multi-boot<br />
          - recovers from at most double fault<br />
          - <a href="https://github.com/koka831/runix">GitHub</a>
        </li>
        <li>
          <h3>Marmoset, a Toy Interpreter in Rust</h3>
          - write a tiny interpreter referring <a href="https://interpreterbook.com/">Writing An Interepreter In Go</a>
        </li>
        <li>
          <h3>Blog using Static Props with Next.js</h3>
          - build a static blog system with Next.js<br />
          - generate edit histries for each posts from <code className="language-unknown">git log --follow</code><br />
        </li>
      </ul>
    </section>
  );
};

export const Links: React.FC = () => {
  return (
    <nav className={styles.links_container}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/koka831"
        className="github"
      >
        <FontAwesomeIcon icon={faGithubSquare} size="2x" color="#504945" />
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://twitter.com/k_0ka"
      >
        <FontAwesomeIcon icon={faTwitterSquare} size="2x" color="#458588" />
      </a>
    </nav>
  );
};

const Contact: React.FC = () => {
  return (
    <section itemScope className={styles.contact_container}>
      <h2>Contact</h2>
      <ul className={styles.contact} aria-label="Contact">
        <li itemProp="email">mail: koka.code+github.io[at]gmail.com</li>
        <li>GPG: FBCA 28DB 3AAD 69A9 C3D2  DB16 2614 F77B B077 D125</li>
        <li>Twitter: <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/k_0ka">k_0ka</a></li>
        <li>GitHub: <a target="_blank" rel="noopener noreferrer" href="https://github.com/koka831">koka831</a></li>
        <li>Qiita: <a target="_blank" rel="noopener noreferrer" href="https://qiita.com/koka" className="qiita">koka</a></li>
      </ul>
      {/* <Links /> */}
    </section>
  );
};

export default Index;
