import InputField from "./InputField";

export default function DimensionInput({ value, setValue }) {
  return (
    <div className="grid grid-cols-3 gap-4">

      <InputField
        label="Chiều dài"
        type="number"
        suffix="cm"
        value={value.length}
        onChange={(e) =>
          setValue({ ...value, length: e.target.value })
        }
      />

      <InputField
        label="Chiều rộng"
        type="number"
        suffix="cm"
        value={value.width}
        onChange={(e) =>
          setValue({ ...value, width: e.target.value })
        }
      />

      <InputField
        label="Chiều cao"
        type="number"
        suffix="cm"
        value={value.height}
        onChange={(e) =>
          setValue({ ...value, height: e.target.value })
        }
      />

    </div>
  );
}