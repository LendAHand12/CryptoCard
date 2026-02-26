export const EyeAndSlashEye = ({ isShow, handleClickEye }) => {
  return (
    <div onClick={handleClickEye} style={{ cursor: "pointer" }}>
      {isShow ? (
        <i class="fa-regular fa-eye"></i>
      ) : (
        <i class="fa-regular fa-eye-slash"></i>
      )}
    </div>
  );
};
