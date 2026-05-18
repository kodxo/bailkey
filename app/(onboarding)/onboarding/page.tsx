"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Step1Role } from "../_components/step-1-role";
import { Step2Operation } from "../_components/step-2-operation";
import { Step3Individual, IndividualProfileData } from "../_components/step-3-individual";
import { Step3Company, CompanyProfileData } from "../_components/step-3-company";
import { Step4Success } from "../_components/step-4-success";
import { onboardingService } from "@/lib/services/onboarding.service";
import type { OnboardingRequestDTO } from "@/lib/types/dto";

export default function OnboardingPage(): React.JSX.Element {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState<number>(1);
  const [role, setRole] = useState<"owner" | "tenant" | null>(null);
  const [operationType, setOperationType] = useState<"individual" | "company" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [individualData, setIndividualData] = useState<IndividualProfileData>({
    firstName: "",
    lastName: "",
    idNumber: "",
    phone: "",
    address: "",
  });

  const [companyData, setCompanyData] = useState<CompanyProfileData>({
    companyName: "",
    rccm: "",
    niu: "",
    phone: "",
    address: "",
  });

  const handleSelectRole = (selectedRole: "owner" | "tenant"): void => {
    setRole(selectedRole);
  };

  const handleSelectOperation = (type: "individual" | "company"): void => {
    setOperationType(type);
  };

  const handleIndividualChange = (field: keyof IndividualProfileData, value: string): void => {
    setIndividualData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompanyChange = (field: keyof CompanyProfileData, value: string): void => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
  };

  const executeSubmission = async (payload: OnboardingRequestDTO): Promise<void> => {
    setLoading(true);
    setError("");

    const response = await onboardingService.completeOnboarding(payload);

    setLoading(false);

    if (!response.success || response.error) {
      setError(response.error || "Une erreur est survenue lors de la configuration.");
      return;
    }

    if (response.success) {
      await user?.reload();
      setStep(4);
    }
  };

  const handleIndividualSubmit = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();
    if (!role || !operationType) return;

    await executeSubmission({
      role,
      operationType,
      firstName: individualData.firstName,
      lastName: individualData.lastName,
      idNumber: individualData.idNumber,
      phone: individualData.phone,
      address: individualData.address,
    });
  };

  const handleCompanySubmit = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();
    if (!role || !operationType) return;

    await executeSubmission({
      role,
      operationType,
      companyName: companyData.companyName,
      rccm: companyData.rccm,
      niu: companyData.niu,
      phone: companyData.phone,
      address: companyData.address,
    });
  };

  const handleFinish = (): void => {
    if (role === "tenant") {
      router.push("/locataire/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const renderStepContent = (): React.JSX.Element => {
    switch (step) {
      case 1:
        return (
          <Step1Role
            selectedRole={role}
            onSelectRole={handleSelectRole}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <Step2Operation
            operationType={operationType}
            onSelectOperation={handleSelectOperation}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        );
      case 3:
        if (operationType === "company") {
          return (
            <Step3Company
              data={companyData}
              loading={loading}
              error={error}
              onChange={handleCompanyChange}
              onBack={() => setStep(2)}
              onSubmit={handleCompanySubmit}
            />
          );
        }
        return (
          <Step3Individual
            data={individualData}
            loading={loading}
            error={error}
            onChange={handleIndividualChange}
            onBack={() => setStep(2)}
            onSubmit={handleIndividualSubmit}
          />
        );
      case 4:
        return (
          <Step4Success
            role={role}
            operationType={operationType}
            entityName={
              operationType === "company"
                ? companyData.companyName
                : `${individualData.firstName} ${individualData.lastName}`.trim()
            }
            onFinish={handleFinish}
          />
        );
      default:
        return (
          <Step1Role
            selectedRole={role}
            onSelectRole={handleSelectRole}
            onNext={() => setStep(2)}
          />
        );
    }
  };

  return (
    <div className="w-full flex justify-center py-6">
      {renderStepContent()}
    </div>
  );
}
