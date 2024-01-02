import React from "react";

import { Layout, Icon } from "../components";
import styles from "./index.module.css";

const Index: React.VFC = () => {
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

const Profile: React.VFC = () => {
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
        <p>I solve problems.</p>
        <p itemProp="role">Software Engineer</p>
        <p>
          Bachelor of Engineering @
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.ynu.ac.jp/"
          >
            YNU
          </a>
        </p>
      </div>
    </section>
  );
};

const Skills: React.VFC = () => {
  return (
    <section className={styles.skills_container}>
      <h1>Skills</h1>
      <ul className={styles.skills} aria-label="Skills">
        <li>
          <h3>Rust</h3>
          some personal experiences in Low-Layer Programming like{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/koka831/runix"
          >
            Hobby Kernel
          </a>
          ,
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/koka831/marmoset"
          >
            Interpreter
          </a>
          , interested in boot loading sequence and Linux kernel especially
          memory mapping.
          <br />
          <br />
          practices{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/koka831/algorithm"
          >
            algorithms
          </a>{" "}
          (AtCoder Highest: 1201).
          <br />
        </li>
        <li>
          <h3>Ruby</h3>
          have some experiences with Ruby on Rails(RoR), devise token auth.
          <br />
          deploy it with capistrano and ECS/ECR.
          <br />I usually develop an API with RoR and serve it with token
          authentication with{" "}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://github.com/lynndylanhurley/devise_token_auth"
          >
            devise_token_auth
          </a>
          .<br />
        </li>
        <li>
          <h3>JavaScript/TypeScript</h3>
          previously I used to develop web-apps in Vue.js/Nuxt.js (and had
          contribution to Nuxt.js docs)
          <br />
          switched to React/Next.js for some reason;
          <br />
          - Hooks API
          <br />
          - has high affinity to TypeScript especially its data store like redux
          with it
          <br />
          <br />
          I usually develop an web-app with Next.js even if it does not require
          SSR/SSG because;
          <br />
          - directory structure convention
          <br />
          - easy to switch using SSR/SSG; productions change continuously
          <br />
          <br />
          <a href="https://koka831.github.io">This Blog</a> is built with
          Next.js.
        </li>
        <li>
          <h3>Python</h3>
          I was researching text summarization methods using machine learning at
          university.
          <br />
          - NLP, Self-Attention model + Encoder-Decoder
          <br />
          - time-series data analysis
          <br />
          <br />
          wrote some contents for{" "}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://tracks.run/"
          >
            track
          </a>{" "}
          and{" "}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://codeprep.jp/"
          >
            CODEPREP
          </a>
          .<br />
        </li>
        <li>
          <h3>Environment</h3>
          - Arch Linux + i3wm + tmux + zsh + Neovim
          <br />
        </li>
        <li>
          <h3>Interests</h3>
          - Oil Painting
          <br />
          - Tea
          <br />
        </li>
      </ul>
    </section>
  );
};

const Projects: React.VFC = () => {
  return (
    <section className={styles.projects_container}>
      <h2>Side Projects</h2>
      <ul>
        <li>
          <h3>
            Automatic-control system for UAV(Unmanned Aerial Vehicle, a.k.a
            Drone)/archived
          </h3>
          - written in C(+ inline asm)
          <br />
          - in-time object recognition in movies from UAVs
          <br />
        </li>
        <li>
          <h3>
            Air Conditioner Controller using Infrared Sensor with Raspberry Pi
            Zero
          </h3>
          - repaired a broken controller with SIR-34ST3F IR device
          <br />
          - written in MicroPython
          <br />
        </li>
        <li>
          <h3>Runix, a Hobby Kernel in Rust</h3>
          - boots on qemu
          <br />
          - accepts keyboard input
          <br />
          - supports 64bits mode and multi-boot
          <br />
          - recovers from at most double fault
          <br />-{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/koka831/runix"
          >
            GitHub
          </a>
          <br />
        </li>
        <li>
          <h3>Marmoset, a Toy Interpreter in Rust</h3>- write a tiny interpreter
          referring{" "}
          <a href="https://interpreterbook.com/">
            Writing An Interpreter In Go
          </a>
          <br />-{" "}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://github.com/koka831/marmoset"
          >
            GitHub
          </a>
          <br />
        </li>
        <li>
          <h3>Blog with Next.js</h3>
          - build a blog system with Next.js
          <br />
          - without UI library; just for fun
          <br />- retrieve edit histories for each posts from{" "}
          <code className="language-unknown">git log --follow</code>
          <br />- comment using github issue with{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/utterance/utterances"
          >
            utterances
          </a>
          <br />
        </li>
      </ul>
    </section>
  );
};

const Contact: React.VFC = () => {
  return (
    <section itemScope className={styles.contact_container}>
      <h2>Contact</h2>
      <ul className={styles.contact} aria-label="Contact">
        <li itemProp="email">mail: koka.code+github.io[at]gmail.com</li>
        <li>GPG: FBCA 28DB 3AAD 69A9 C3D2 DB16 2614 F77B B077 D125</li>
        <li>
          Twitter:{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/k_0ka"
          >
            k_0ka
          </a>
        </li>
        <li>
          GitHub:{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/koka831"
          >
            koka831
          </a>
        </li>
        <li>
          Qiita:{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://qiita.com/koka"
            className="qiita"
          >
            koka
          </a>
        </li>
      </ul>
    </section>
  );
};

export default Index;
