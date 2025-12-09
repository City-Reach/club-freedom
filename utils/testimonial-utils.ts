export const getApprovalStatusText = (approved: boolean | undefined) => {
  const approvalText =
    approved === true
      ? "Approved"
      : approved === false
        ? "Disapproved"
        : "Pending";
  return approvalText;
};
