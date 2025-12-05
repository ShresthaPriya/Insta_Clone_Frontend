import { FaTimes } from "react-icons/fa";
import { FormButton } from "../components/Button";
import { useState, useRef, useEffect } from "react";
import lockLogo from "../assets/padlock_5796702.png";
import { toast } from "react-toastify";

interface OtpModalProps {
  otpPhone: string;
  otp: string;
  onClose: () => void;
  onResendOtp: () => Promise<string>;
  onVerify: (enteredOtp: string) => Promise<void>;
  waitSeconds: number;
}

const OtpModal = ({ otp, waitSeconds, onClose, onResendOtp, onVerify }: OtpModalProps) => {
  const [inputs, setInputs] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [timeLeft, setTimeLeft] = useState(waitSeconds);
  const [closeOtpTimer, setcloseOtpTimer] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => setcloseOtpTimer(false), 10000); // 10 sec
    return () => clearTimeout(timer);
  }, [otp]);

  useEffect(() => {
    setTimeLeft(waitSeconds);
  }, [waitSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !inputs[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyClick = async () => {
    if (timeLeft <= 0) return toast.error("OTP expired! Please resend.");
    const enteredOtp = inputs.join("");
    if (enteredOtp.length < 6) return toast.error("Enter complete 6-digit OTP.");
    await onVerify(enteredOtp);
  };

  const handleResendClick = async () => {
    try {
      const newOtp = await onResendOtp();
      toast.success("OTP resent successfully!");
      setInputs(["", "", "", "", "", ""]);
      setTimeLeft(waitSeconds);
      inputRefs.current[0]?.focus();
      setcloseOtpTimer(true);
      setTimeout(() => setcloseOtpTimer(false), 10000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <>
      {otp && closeOtpTimer && (

        <div className="flex justify-end fixed top-4 right-4 z-50">
          <div className="w-60 p-4 bg-white rounded-md shadow-xl">
            <p className="text-blue-700 text-center">
              Your OTP code is
              <br />
              <span className="font-semibold text-2xl">{otp}</span>
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center inset-0 fixed bg-black bg-opacity-30 z-40">
        <div className="flex flex-col gap-4 bg-white rounded-md shadow-2xl p-8 w-96">
          <div className="flex justify-between items-center">
            <FaTimes className="text-xl font-bold cursor-pointer" onClick={onClose} />
            <span className="text-red-500 font-bold">{formatTime(timeLeft)}</span>
          </div>

          <div className="flex justify-center">
            <img src={lockLogo} className="w-20" />
          </div>

          <p className="text-blue-700 text-center">Enter 6-digit authentication code</p>

          <div className="flex flex-row justify-center gap-3 w-full">
            {inputs.map((value, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                ref={el => { inputRefs.current[i] = el; }}
                value={value}
                onChange={e => handleChange(e.target.value, i)}
                onKeyDown={e => handleKeyDown(e, i)}
                className="w-12 h-12 border border-gray-400 rounded-md text-center text-lg font-semibold focus:outline-none focus:border-blue-500"
              // disabled={timeLeft <= 0}
              />
            ))}
          </div>

          <FormButton
            type="button"
            text="Verify"
            color="primary"
            size="md"
            rounded="none"
            className="w-full"
            onClick={handleVerifyClick}
            disabled={timeLeft <= 0}
          />

          <div className="flex justify-center gap-4 text-sm mt-2">
            <span>Didn't receive the code?</span>
            <button
              className={`text-blue-500 ${timeLeft > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleResendClick}
            // disabled={timeLeft > 0}
            >
              Resend
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpModal;
