import axios from "axios";
import jwtDefaultConfig from "./jwtDefaultConfig";
import jwt from "jsonwebtoken";
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL + "/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig };
  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false;

  // ** For Refreshing Token
  subscribers = [];

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig };
    // ** Request Interceptor
    axiosInstance.interceptors.request.use(
      (config) => {
        const accessToken = JSON.parse(this.getToken());
        if (accessToken) {
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ** Add request/response interceptor
    // axiosInstance.interceptors.response.use(
    //   (response) => response,
    //   (error) => {
    //     // ** const { config, response: { status } } = error
    //     const { config, response } = error;
    //     const originalRequest = config;

    //     // ** if (status === 401) {
    //     if (response && response.status === 401) {
    //       if (!this.isAlreadyFetchingAccessToken) {
    //         this.isAlreadyFetchingAccessToken = true;
    //         this.refreshToken().then((r) => {
    //           this.isAlreadyFetchingAccessToken = false;

    //           // ** Update accessToken in localStorage
    //           this.setToken(r.data.accessToken);
    //           this.setRefreshToken(r.data.refreshToken);

    //           this.onAccessTokenFetched(r.data.accessToken);
    //         });
    //       }
    //       const retryOriginalRequest = new Promise((resolve) => {
    //         this.addSubscriber((accessToken) => {
    //           // ** Make sure to assign accessToken according to your response.
    //           // ** Check: https://pixinvent.ticksy.com/ticket/2413870
    //           // ** Change Authorization header
    //           originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
    //           resolve(this.axios(originalRequest));
    //         });
    //       });
    //       return retryOriginalRequest;
    //     }
    //     return Promise.reject(error);
    //   }
    // );
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken)
    );
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName);
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName);
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value);
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value);
  }

  async login(...args) {
    // let res =  axiosInstance.post(this.jwtConfig.loginEndpoint, ...args);
    const res = await axiosInstance
      .post(this.jwtConfig.loginEndpoint, ...args)
      .then((res) => {
        return res.data;
      });
    let error = {
      email: ["Something went wrong"],
    };

    const user = res.user;
    const jwtConfigVal = {
      secret: res.token,
      refreshTokenSecret: res.token,
      expireTime: "10m",
      refreshTokenExpireTime: "10m",
    };

    if (user) {
      if (res.role_id == 1) {
        user.role = "admin";
      } else if (res.role_id == 2) {
        user.role = "Partner";
      } else if (res.role_id == 3) {
        user.role = "staff";
      }

      user.ability = [
        {
          action: "manage",
          subject: "all",
        },
      ];
      const accessToken = jwtConfigVal.secret;
      const refreshToken = jwtConfigVal.refreshTokenSecret;
      const sidebar = res.sidebar;

      axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${accessToken}`,
      };

      const userData = { ...user };

      // delete userData.password

      const response = {
        userData,
        accessToken,
        refreshToken,
        sidebar,
      };

      return response;
    } else {
      error = "Email or Password is Invalid";
    }

    return [];
  }

  async homePage(...args) {
    // let res =  axiosInstance.post(this.jwtConfig.loginEndpoint, ...args);
    const res = await axiosInstance.get("/business/type-list").then((res) => {
      return res.data;
    });
    return res;
  }

  async register(...args) {
    const res = await axiosInstance
      .post(this.jwtConfig.registerEndpoint, ...args)
      .then((res) => {
        return res.data;
      });
    let error = {
      email: ["Something went wrong"],
    };

    const user = res.user;
    const jwtConfigVal = {
      secret: res.token,
      refreshTokenSecret: res.token,
      expireTime: "10m",
      refreshTokenExpireTime: "10m",
    };

    if (user) {
      user.role = "admin";
      user.ability = [
        {
          action: "manage",
          subject: "all",
        },
      ];

      const accessToken = jwtConfigVal.secret;
      const refreshToken = jwtConfigVal.refreshTokenSecret;
      const sidebar = res.sidebar;
      axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${accessToken}`,
      };

      const userData = { ...user };

      // delete userData.password

      const response = {
        userData,
        accessToken,
        refreshToken,
        sidebar,
      };
      return response;
    } else {
      error = "Email or Password is Invalid";
    }

    return [];
  }

  async refreshToken() {
    return await axiosInstance.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    });
  }
}
