import React from "react";
import { Form, Radio } from "antd";
import { EditorProps } from "../BaseChartEditor";
import { LineChartDomain } from "../../LineChart";

export default function LineDomainEditor({
  specState: [spec, setSpec],
}: EditorProps<LineChartDomain>) {
  return (
    <Form.Item label="X Axis" wrapperCol={{ xs: { span: 6 } }}>
      <Radio.Group
        value={spec.xAxis}
        onChange={(e) => setSpec({ ...spec, xAxis: e.target.value })}
      >
        {LineDomainXAxisRT.alternatives.map(({ value }, idx) => (
          <Radio key={idx} value={value}>
            {value}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
  );
}
