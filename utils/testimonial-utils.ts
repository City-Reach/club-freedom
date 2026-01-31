export const getApprovalStatusText = (approved: boolean | undefined) => {
  const approvalText =
    approved === true
      ? "Published"
      : approved === false
        ? "Not Published"
        : "Pending";
  return approvalText;
};
