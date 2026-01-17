import { useMemo, useState, useEffect } from 'react'
import './App.css'
import { initGA, logPageView } from './utils/analytics'

function App() {
  useEffect(() => {
    initGA()
    logPageView(window.location.pathname + window.location.search)
  }, [])

  const [amountInput, setAmountInput] = useState('42,000,000')
  const [annualRate, setAnnualRate] = useState(4.1)
  const [months, setMonths] = useState(48)

  const parseNumber = (value: string) =>
    Number(value.replace(/[^\d.]/g, '')) || 0

  const amount = parseNumber(amountInput)

  const formatKrw = (value: number) =>
    new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(value)

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US', {
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
        <nav className="nav">
          <a href="#calculator">계산기</a>
          <a href="#guide">가이드</a>
          <a href="#policy">정책</a>
        </nav>
        <button className="ghost-button" onClick={() => location.hash = '#contact'}>
          문의하기
        </button>
      </header>

      <main className="layout">
        <section className="hero">
          <p className="eyebrow">원페이지 상환 계산</p>
          <h1>
            대출 상환 계산기, 상환메이트
            <span>원리금균등 기준 월 상환액과 총 이자를 즉시 계산하세요.</span>
          </h1>
          <p className="hero-description">
            대출 금액, 금리, 상환 기간을 입력하면 월 상환액, 총 상환액, 총 이자를
            바로 확인할 수 있습니다. 숫자를 바꾸면 즉시 업데이트됩니다.
          </p>
          <div className="hero-badges">
            <span>실시간 계산</span>
            <span>모바일 최적화</span>
            <span>무료 사용</span>
          </div>
        </section>

        <section className="calculator" id="calculator">
          <div className="calculator-panel">
            <div className="field">
              <label htmlFor="amount">대출 금액</label>
              <div className="field-input">
                <input
                  id="amount"
                  type="text"
                  inputMode="numeric"
                  value={amountInput}
                  onChange={(event) => setAmountInput(event.target.value)}
                  onBlur={(event) =>
                    setAmountInput(formatNumber(parseNumber(event.target.value)))
                  }
                />
                <span>원</span>
              </div>
              <input
                type="range"
                min={1000000}
                max={200000000}
                step={500000}
                value={amount}
                onChange={(event) =>
                  setAmountInput(formatNumber(Number(event.target.value)))
                }
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

        <section className="content" id="guide">
          <div className="content-header">
            <p className="eyebrow">상환 가이드</p>
            <h2>계산 결과를 읽는 방법과 절감 포인트를 알려드립니다.</h2>
            <p>
              아래 내용은 실제 대출 조건을 이해하는 데 도움이 되는 참고
              정보입니다. 필요한 경우 금융기관의 안내를 함께 확인하세요.
            </p>
          </div>
          <div className="content-grid">
            <article className="content-card">
              <h3>계산 기준</h3>
              <ul>
                <li>원리금균등 상환을 기준으로 월 상환액을 계산합니다.</li>
                <li>중도상환수수료, 보증료, 취급수수료는 반영하지 않습니다.</li>
                <li>금리는 연이율 기준이며 매월 동일한 비율로 적용됩니다.</li>
              </ul>
            </article>
            <article className="content-card">
              <h3>핵심 체크리스트</h3>
              <ul>
                <li>대환 가능 여부와 금리 인하 조건을 먼저 확인하세요.</li>
                <li>월 소득 대비 상환 비율이 30%를 넘지 않게 관리하세요.</li>
                <li>예상치와 실제 상환액의 차이를 항상 점검하세요.</li>
              </ul>
            </article>
            <article className="content-card">
              <h3>예시 시뮬레이션</h3>
              <table>
                <thead>
                  <tr>
                    <th>대출 조건</th>
                    <th>월 상환액</th>
                    <th>총 이자</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>3,000만원 · 4% · 36개월</td>
                    <td>약 88만원</td>
                    <td>약 170만원</td>
                  </tr>
                  <tr>
                    <td>5,000만원 · 5% · 60개월</td>
                    <td>약 94만원</td>
                    <td>약 630만원</td>
                  </tr>
                </tbody>
              </table>
              <p className="note">
                실제 결과는 대출 조건과 상환 방식에 따라 달라질 수 있습니다.
              </p>
            </article>
            <article className="content-card">
              <h3>사용자 중심 원칙</h3>
              <p>
                상환메이트는 중복된 정보를 늘리기보다 핵심 계산과 이해에 필요한
                정보만 제공합니다. 사용자가 빠르게 원하는 정보를 찾고 다시
                방문할 수 있도록 명확한 구조로 구성합니다.
              </p>
            </article>
          </div>
        </section>

        <section className="policy" id="policy">
          <div className="content-header">
            <p className="eyebrow">정책 안내</p>
            <h2>투명한 정보 제공을 위한 운영 원칙과 정책입니다.</h2>
          </div>
          <div className="policy-grid">
            <article className="policy-card">
              <h3>개인정보처리방침</h3>
              <p>
                상환메이트는 계산을 위해 입력된 값을 서버에 저장하지 않습니다.
                모든 계산은 브라우저에서만 처리됩니다. 다만 Google AdSense는
                쿠키를 사용하여 맞춤 광고를 제공할 수 있으며, 사용자는 브라우저
                설정에서 쿠키 사용을 제한할 수 있습니다.
              </p>
            </article>
            <article className="policy-card">
              <h3>이용약관</h3>
              <p>
                본 계산 결과는 참고용이며 실제 금융계약 조건과 차이가 있을 수
                있습니다. 제공되는 정보는 재무 상담이나 법적 조언이 아닙니다.
              </p>
            </article>
            <article className="policy-card" id="contact">
              <h3>문의 및 운영</h3>
              <p>
                문의 사항은 GitHub Issues를 통해 접수합니다. 빠른 개선을 위해
                사용 환경과 입력값을 함께 남겨주세요.
              </p>
              <a
                className="link"
                href="https://github.com/jaeyul5845/lone-cal/issues"
                target="_blank"
                rel="noreferrer"
              >
                GitHub 문의 바로가기
              </a>
            </article>
            <article className="policy-card">
              <h3>운영자 정보</h3>
              <p>
                본 사이트는 개인 프로젝트로 운영됩니다. 운영자 정보와 연락처는
                검토 요청 전 정확한 값으로 업데이트해 주세요.
              </p>
            </article>
            <article className="policy-card">
              <h3>콘텐츠 원칙</h3>
              <p>
                중복되거나 의미 없는 콘텐츠를 만들지 않습니다. 핵심 계산 결과와
                이해에 필요한 정보에 집중해 사용자가 쉽게 탐색할 수 있도록
                구성합니다.
              </p>
            </article>
            <article className="policy-card">
              <h3>광고 고지</h3>
              <p>
                광고는 콘텐츠를 방해하지 않는 위치에만 배치하며, 콘텐츠보다 더
                눈에 띄지 않도록 구성합니다. 광고 정책에 맞지 않는 페이지에는
                광고를 게재하지 않습니다.
              </p>
            </article>
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
