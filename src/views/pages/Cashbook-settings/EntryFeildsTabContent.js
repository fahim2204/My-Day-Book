// ** React Imports
import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  FormFeedback,
} from "reactstrap";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Demo Components
import ContactListTable from "./contact-table/ContactListTable";
import CategoryListTable from "./category-table/CategoryListTable";
import PaymentListTable from "./payment-table/PaymentListTable";
import EntryFieldsList from "./EntryFieldsList";

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`;
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`;
  } else {
    return "";
  }
};

const defaultValues = {
  newPassword: "",
  currentPassword: "",
  retypeNewPassword: "",
};

const SecurityTabContent = () => {
  const SignupSchema = yup.object().shape({
    currentPassword: yup
      .string()
      .min(8, (obj) =>
        showErrors("Current Password", obj.value.length, obj.min)
      )
      .required(),
    newPassword: yup
      .string()
      .min(8, (obj) => showErrors("New Password", obj.value.length, obj.min))
      .required(),
    retypeNewPassword: yup
      .string()
      .min(8, (obj) =>
        showErrors("Retype New Password", obj.value.length, obj.min)
      )
      .required()
      .oneOf([yup.ref(`newPassword`), null], "Passwords must match"),
  });
  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  });

  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      return null;
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: "manual",
          });
        }
      }
    }
  };

  return (
    <Fragment>
      <Routes>
        <Route exact path="/" element={<EntryFieldsList />} />
        <Route exact path="/contact" element={<ContactListTable />} />
        <Route exact path="/category" element={<CategoryListTable />} />
        <Route exact path="/payment-mode" element={<PaymentListTable />} />
      </Routes>
    </Fragment>
  );
};

export default SecurityTabContent;
