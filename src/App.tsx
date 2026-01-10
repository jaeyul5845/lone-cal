import { useMemo, useState } from 'react'
import './App.css'

function App() {
  const [amount, setAmount] = useState(42000000)
  const [annualRate, setAnnualRate] = useState(4.1)
  const [months, setMonths] = useState(48)

  const formatKrw = (value: number) =>
    new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(value)

  const { monthlyPayment, totalPayment, totalInterest } = useMemo(() => {
    const principal = Math.max(0, amount)
    const n = Math.max(1, months)
    const r = Math.max(0, annualRate) / 12 / 100
    if (r === 0) {
      const payment = principal / n
      return {
        monthlyPayment: payment,
        totalPayment: payment * n,
        totalInterest: 0,
      }
    }
    const factor = Math.pow(1 + r, n)
    const payment = principal * (r * factor) / (factor - 1)
    const total = payment * n
    return {
      monthlyPayment: payment,
      totalPayment: total,
      totalInterest: total - principal,
    }
  }, [amount, annualRate, months])

  return (
    <div className="page">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark">M</span>
          <div>
            <p className="brand-title">상환메이트</p>
            <p className="brand-subtitle">대출 상환 계산기</p>
          </div>
        </div>
        <button className="ghost-button">계산 결과 저장</button>
      </header>

      <main className="layout">
        <section className="hero">
          <p className="eyebrow">원페이지 상환 계산</p>
          <h1>
            대출 조건을 넣으면
            <span>월 상환액이 즉시 계산됩니다.</span>
          </h1>
          <p className="hero-description">
            원리금균등 방식 기준으로 총 상환액과 총 이자를 함께 확인하세요.
            숫자를 바꾸면 바로 업데이트됩니다.
          </p>
          <div className="hero-badges">
            <span>실시간 계산</span>
            <span>모바일 최적화</span>
            <span>무료 사용</span>
          </div>
        </section>

        <section className="calculator">
          <div className="calculator-panel">
            <div className="field">
              <label htmlFor="amount">대출 금액</label>
              <div className="field-input">
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  min={0}
                  step={100000}
                  onChange={(event) => setAmount(Number(event.target.value))}
                />
                <span>원</span>
              </div>
              <input
                type="range"
                min={1000000}
                max={200000000}
                step={500000}
                value={amount}
                onChange={(event) => setAmount(Number(event.target.value))}
              />
            </div>
            <div className="field">
              <label htmlFor="rate">연 이자율</label>
              <div className="field-input">
                <input
                  id="rate"
                  type="number"
                  value={annualRate}
                  min={0}
                  max={20}
                  step={0.1}
                  onChange={(event) => setAnnualRate(Number(event.target.value))}
                />
                <span>%</span>
              </div>
              <input
                type="range"
                min={0}
                max={12}
                step={0.1}
                value={annualRate}
                onChange={(event) => setAnnualRate(Number(event.target.value))}
              />
            </div>
            <div className="field">
              <label htmlFor="months">상환 기간</label>
              <div className="field-input">
                <input
                  id="months"
                  type="number"
                  value={months}
                  min={1}
                  max={360}
                  step={1}
                  onChange={(event) => setMonths(Number(event.target.value))}
                />
                <span>개월</span>
              </div>
              <input
                type="range"
                min={12}
                max={360}
                step={6}
                value={months}
                onChange={(event) => setMonths(Number(event.target.value))}
              />
            </div>
          </div>

          <div className="result-panel">
            <div className="result-main">
              <p>월 예상 상환액</p>
              <strong>{formatKrw(monthlyPayment)}</strong>
              <span>원리금균등 기준</span>
            </div>
            <div className="result-cards">
              <div>
                <p>총 상환액</p>
                <strong>{formatKrw(totalPayment)}</strong>
              </div>
              <div>
                <p>총 이자</p>
                <strong>{formatKrw(totalInterest)}</strong>
              </div>
            </div>
            <div className="result-tip">
              <h3>빠른 팁</h3>
              <p>
                금리를 0.5%p 낮추면 총 이자가 크게 줄어듭니다. 대환 가능
                여부를 함께 확인해보세요.
              </p>
            </div>
            <button className="primary-button">결과 공유하기</button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>상환메이트 · 개인 대출 계산을 위한 간단 도구</p>
        <p>* 본 계산 결과는 참고용이며 실제 조건과 다를 수 있습니다.</p>
      </footer>
    </div>
  )
}

export default App
