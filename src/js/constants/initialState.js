export default {
  auth: {
    authed: false,
    error: '',
  },
  companyInfo: {
    name: '',
    info: '',
    logo: '',
    introduction: '',
    url: '',
    image: '',
    banner: '',
    industries: [],
  },
  industries: {
    industriesAll: [],
    industryInfo: {
      id: '',
      name: '',
      pdfUrl: '',
      banner: '',
      featuredCompanies: {
        total: 0,
        data: [],
      },
    },
  },
  tellus: {
    download: false,
    industry: false,
    company: false,
    downFile: false,
  },
  menu: {
    logo: '',
    industries: [],
  },
  leads: {
    filter: {},
    sort: {
      createdAt: -1,
    },
    currentPage: 1,
    total: 0,
    data: [],
  },
};
