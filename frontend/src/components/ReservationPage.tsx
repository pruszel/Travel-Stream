import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ReservationForm from "./ReservationForm";

const ReservationPage: React.FC = () => {
  const [formSubmissionSuccess, setFormSubmissionSuccess] =
    React.useState(false);

  const handleSubmissionSuccess = (success: boolean) => {
    setFormSubmissionSuccess(success);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Travel Reservation Request</CardTitle>
          <CardDescription>
            {formSubmissionSuccess
              ? ""
              : "Please fill out the form below to request a reservation."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            {!formSubmissionSuccess ? (
              <ReservationForm onSubmissionSuccess={handleSubmissionSuccess} />
            ) : (
              <div>
                <p>
                  Thank you, your reservation details have been recieved. One of
                  our agents will be in touch with you soon.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationPage;
