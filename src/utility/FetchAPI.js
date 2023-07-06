import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BASE_URL}/api/v1/`,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Register
export const register = async (data) => {
  return await axiosInstance.post(`/register`, data).then((res) => {
    return res.data;
  });
};

// Api request started =======
export const booksByBussinessData = async (id) => {
  return await axiosInstance.get(`/book/index/${id}`).then((res) => {
    return res.data;
  });
};

export const transactionAddModalData = async (id) => {
  return await axiosInstance
    .get(`/bookTransaction/transactionAddModalData/${id}`)
    .then((res) => {
      return res.data;
    });
};

export const getCategory = async () => {
  return await axiosInstance.get(`/business/category-list`).then((res) => {
    return res.data;
  });
};

export const getBusinessDataById = async (id) => {
  return await axiosInstance.get(`/business/index/${id}`).then((res) => {
    return res.data;
  });
};

export const FetchBusinessRelatedData = async () => {
  return await axiosInstance
    .get(`/business/businessrelatedData`)
    .then((res) => {
      return res.data;
    });
};

export const GetTransactionData = async (book_id) => {
  return await axiosInstance
    .get(`/bookTransaction/index/${book_id}`)
    .then((res) => {
      return res.data;
    });
};

export const GetDashboardTransactionData = async (businessId, book_id) => {
  return await axiosInstance
    .get(`/GetDashboardTransactionData/${businessId}/${book_id}`)
    .then((res) => {
      return res.data;
    });
};

export const storeBookTransactionData = async (data) => {
  return await axiosInstance
    .post(`/bookTransaction/store`, data)
    .then((res) => {
      return res.data;
    });
};

export const CreateNewCategory = async (data) => {
  return await axiosInstance
    .post(`/transactionCategory/store`, data)
    .then((res) => {
      return res.data;
    });
};

export const UpdateTransactionCategory = async (data) => {
  return await axiosInstance
    .post(`/transactionCategory/update`, data)
    .then((res) => {
      return res.data;
    });
};

export const deleteTransactionCategory = async (data) => {
  return await axiosInstance
    .post(`/transactionCategory/delete`, data)
    .then((res) => {
      return res.data;
    });
};

export const GetTransactionCategory = async (book_id) => {
  return await axiosInstance
    .get(`/transactionCategory/list/${book_id}`)
    .then((res) => {
      return res.data;
    });
};

export const CreateNewContact = async (data) => {
  return await axiosInstance
    .post(`/bookContact/store`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      return res.data;
    });
};

export const UpdateContact = async (data) => {
  return await axiosInstance
    .post(`/bookContact/update`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      return res.data;
    });
};

export const makePaymentMode = async (data) => {
  return await axiosInstance.post(`/PaymentMethod/store`, data).then((res) => {
    return res.data;
  });
};

export const disableContactById = async (data) => {
  return await axiosInstance.post(`/bookContact/disable`, data).then((res) => {
    return res.data;
  });
};

export const enableContactById = async (data) => {
  return await axiosInstance.post(`/bookContact/enable`, data).then((res) => {
    return res.data;
  });
};

export const deleteContact = async (data) => {
  return await axiosInstance.post(`/bookContact/delete`, data).then((res) => {
    return res.data;
  });
};

export const GetContactList = async (data) => {
  return await axiosInstance.get(`/bookContact/index/${data}`).then((res) => {
    return res.data;
  });
};

export const getPaymentModeList = async (data) => {
  return await axiosInstance.get(`/PaymentMethod/index/${data}`).then((res) => {
    return res.data;
  });
};

export const AddnewBook = async (data) => {
  return await axiosInstance.post(`/book/store`, data).then((res) => {
    return res.data;
  });
};

export const CreateNewUser = async (data) => {
  return await axiosInstance.post(`/users/store`, data).then((res) => {
    return res.data;
  });
};

export const GetUserData = async () => {
  return await axiosInstance.get(`/users/index`).then((res) => {
    return res.data;
  });
};

export const EditnewBook = async (data) => {
  return await axiosInstance.post(`/book/update`, data).then((res) => {
    return res.data;
  });
};

export const AddNewBusiness = async (data) => {
  return await axiosInstance.post(`/business/store`, data).then((res) => {
    return res.data;
  });
};

export const deleteBusiness = async (data) => {
  return await axiosInstance.post(`/business/delete`, data).then((res) => {
    return res.data;
  });
};

export const deleteCashBook = async (data) => {
  return await axiosInstance.post(`/book/delete`, data).then((res) => {
    return res.data;
  });
};

export const updateBookTransaction = async (data) => {
  return await axiosInstance
    .post(`/bookTransaction/update`, data)
    .then((res) => {
      return res.data;
    });
};

export const deleteBookTransaction = async (data) => {
  return await axiosInstance
    .post(`/bookTransaction/delete`, data)
    .then((res) => {
      return res.data;
    });
};

export const getNotes = async () => {
  return await axiosInstance.get(`/note/index`).then((res) => {
    return res.data;
  });
};

export const AddNewNote = async (data) => {
  return await axiosInstance.post(`/note/store`, data).then((res) => {
    return res.data;
  });
};

export const deleteNote = async (data) => {
  return await axiosInstance.post(`/note/delete`, data).then((res) => {
    return res.data;
  });
};

export const updateNote = async (data) => {
  return await axiosInstance.post(`/note/update`, data).then((res) => {
    return res.data;
  });
};

export const updatePaymentMethod = async (data) => {
  return await axiosInstance.post(`/PaymentMethod/update`, data).then((res) => {
    return res.data;
  });
};

export const deletePaymentMehod = async (data) => {
  return await axiosInstance.post(`/PaymentMethod/delete`, data).then((res) => {
    return res.data;
  });
};

export const resetPassword = async (data) => {
  return await axiosInstance.post(`/reset-password`, data).then((res) => {
    return res.data
  })
}

export const deleteUser = async (id) => {
  return await axiosInstance.post(`/users/delete`, id).then((res) => {
    return res.data
  })
}