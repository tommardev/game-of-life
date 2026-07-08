import './Header.css';

interface HeaderProps {
  generation: number;
}

export const Header = ({ generation }: HeaderProps) => {
  return (
    <header className="header">
      <h1>Conway's Game of Life</h1>
      <p className="subtitle">Where pixels desperately struggle for survival, just like you.</p>
      <div className="stats">
        Generation: <span>{generation}</span>
      </div>
    </header>
  );
};
