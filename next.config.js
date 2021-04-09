module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/about(/?)",
        destination: "/",
        permanent: true
      },
      {
        source: "/2020/06/05/install-arch-linux(/?)",
        destination: "/posts/2020-06-05-install-arch-linux/",
        permanent: true
      },
      {
        source: "/2019/11/18/abc132-e(/?)",
        destination: "/posts/2019-11-18-abc132-e/",
        permanent: true
      },
      {
        source: "/2019/10/06/nuxt-sharing-component(/?)",
        destination: "/posts/2019-10-06-nuxt-sharing-component/",
        permanent: true
      },
      {
        source: "/2019/08/12/abc110-d(/?)",
        destination: "/posts/2019-08-12-abc110-d/",
        permanent: true
      },
      {
        source: "/2019/08/08/autolock-with-yubikey(/?)",
        destination: "/posts/2019-08-08-autolock-with-yubikey/",
        permanent: true
      },
      {
        source: "/2019/07/27/linux-usergroup(/?)",
        destination: "/posts/2019-07-27-linux-usergroup/",
        permanent: true
      },
      {
        source: "/2019/07/15/internal-vue(/?)",
        destination: "/posts/2019-07-15-internal-vue/",
        permanent: true
      },
    ];
  }
};
