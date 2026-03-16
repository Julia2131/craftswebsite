import InputField from "./InputField";

export default function DimensionInput({
  value,
  setValue,
  errors = {},
  validateSize,
}) {
  return (
    <div className="grid grid-cols-3 gap-4">

      <InputField
        id="product-length"
        label="Chiều dài gói hàng"
        type="number"
        suffix="cm"
        min={0}
        value={value.length}
        error={errors.length}
        placeholder="0"
        helperText="Chiều dài gói hàng"
        onChange={(e) => {
          const v = e.target.value;

          setValue({
            ...value,
            length: v,
          });

          validateSize("length", v);
        }}
      />

      <InputField
        id="product-width"
        label="Chiều rộng gói hàng"
        type="number"
        suffix="cm"
        min={0}
        value={value.width}
        error={errors.width}
        placeholder="0"
        helperText="Chiều rộng gói hàng"
        onChange={(e) => {
          const v = e.target.value;

          setValue({
            ...value,
            width: v,
          });

          validateSize("width", v);
        }}
      />

      <InputField
        id="product-height"
        label="Chiều cao gói hàng"
        type="number"
        suffix="cm"
        min={0}
        value={value.height}
        error={errors.height}
        placeholder="0"
        helperText="Chiều cao gói hàng"
        onChange={(e) => {
          const v = e.target.value;

          setValue({
            ...value,
            height: v,
          });

          validateSize("height", v);
        }}
      />

    </div>
  );
}