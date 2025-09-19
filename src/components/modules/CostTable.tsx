import { toUsCurrency } from "@utils/toUsCurrency";

interface CostTableProps {
  className?: string;
  items: {
    title: string;
    cost: number;
  }[];
}

const CostTable = ({ items, className }: CostTableProps) => {
  // add the cost of all items
  const totalCost = items.reduce((acc, { cost }) => acc + cost, 0);
  return (
    <table className={`costTable${className ? ` ${className}` : ""}`}>
      <thead>
        <tr>
          <th>
            <span>Total Cost</span>
          </th>
          <th>
            <span>{toUsCurrency(totalCost)}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map(({ title, cost }) => (
          <tr key={`${title}${cost}`}>
            <td>
              <span>{title}</span>
            </td>
            <td>
              <span>{toUsCurrency(cost)}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { CostTable };
