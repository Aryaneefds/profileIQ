import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout';
import { Card, Button } from '../../components/ui';

export default function Methodology() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">ProfileIQ Methodology</h1>
          <p className="mt-4 text-lg text-gray-600">
            A transparent, equitable approach to evaluating non-academic profiles
          </p>
        </div>

        {/* Core Philosophy */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Core Philosophy</h2>
          <p className="text-gray-600 mb-4">
            ProfileIQ was designed to address fundamental inequities in how non-academic
            achievements are evaluated. Our system prioritizes:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Initiative over access:</strong> What you built matters more than what you had access to.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Depth over breadth:</strong> Sustained commitment outweighs activity count.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Context matters:</strong> Achievements are evaluated relative to available resources and opportunities.</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Growth trajectory:</strong> Improvement over time signals potential.</span>
            </li>
          </ul>
        </Card>

        {/* Evaluation Dimensions */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Evaluation Dimensions</h2>
          <p className="text-gray-600 mb-6">
            Each profile is evaluated across four key dimensions, scored from 0-100:
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-primary-500 pl-4">
              <h3 className="font-semibold text-gray-900">Leadership Impact</h3>
              <p className="text-gray-600 text-sm mt-1">
                Measures genuine leadership responsibility, not just titles. We evaluate decision-making
                authority, team influence, and the scope of leadership responsibilities. A student who
                meaningfully leads a small team scores higher than one with a nominal title in a large organization.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900">Execution Depth</h3>
              <p className="text-gray-600 text-sm mt-1">
                Evaluates follow-through, sustained effort, and tangible outcomes. Hours invested,
                duration of commitment, and measurable results all factor in. Starting something is easy;
                executing consistently is what we measure.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900">Growth Trajectory</h3>
              <p className="text-gray-600 text-sm mt-1">
                Tracks progression over time: increasing responsibility, expanding scope, and deepening
                expertise. A student who grows from participant to leader demonstrates valuable development.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-gray-900">Context-Adjusted Impact</h3>
              <p className="text-gray-600 text-sm mt-1">
                Normalizes achievements based on available resources and opportunities. A first-generation
                student from a rural area starting a local tutoring program may demonstrate more initiative
                than a student with extensive resources attending a prestigious summer program.
              </p>
            </div>
          </div>
        </Card>

        {/* Score Interpretation */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Score Interpretation</h2>
          <p className="text-gray-600 mb-6">
            ProfileIQ scores follow a normalized distribution to ensure meaningful differentiation:
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-20 text-right font-mono font-semibold text-gray-900">85-100</div>
              <div className="w-48 bg-gray-200 rounded h-4">
                <div className="h-4 bg-green-500 rounded" style={{ width: '100%' }} />
              </div>
              <div className="text-sm text-gray-600">Exceptional - Top tier profiles</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-right font-mono font-semibold text-gray-900">70-84</div>
              <div className="w-48 bg-gray-200 rounded h-4">
                <div className="h-4 bg-green-400 rounded" style={{ width: '84%' }} />
              </div>
              <div className="text-sm text-gray-600">Strong - Well-developed profiles</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-right font-mono font-semibold text-gray-900">50-69</div>
              <div className="w-48 bg-gray-200 rounded h-4">
                <div className="h-4 bg-yellow-400 rounded" style={{ width: '69%' }} />
              </div>
              <div className="text-sm text-gray-600">Average - Typical student profile</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-right font-mono font-semibold text-gray-900">30-49</div>
              <div className="w-48 bg-gray-200 rounded h-4">
                <div className="h-4 bg-orange-400 rounded" style={{ width: '49%' }} />
              </div>
              <div className="text-sm text-gray-600">Developing - Room for growth</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 text-right font-mono font-semibold text-gray-900">0-29</div>
              <div className="w-48 bg-gray-200 rounded h-4">
                <div className="h-4 bg-red-400 rounded" style={{ width: '29%' }} />
              </div>
              <div className="text-sm text-gray-600">Limited - Early stage or insufficient data</div>
            </div>
          </div>
        </Card>

        {/* What We Don't Reward */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What We Don't Reward</h2>
          <p className="text-gray-600 mb-4">
            To ensure equitable evaluation, ProfileIQ explicitly does not give higher scores for:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>Prestigious institution names or brand recognition</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>Expensive programs, travel, or equipment-dependent activities</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>Activity count alone (10 shallow activities score lower than 3 deep ones)</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>Titles without corresponding responsibility or impact</span>
            </li>
          </ul>
        </Card>

        {/* For Counselors */}
        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">For Counselors</h2>
          <p className="text-gray-600 mb-4">
            ProfileIQ provides counselors with standardized evaluation data to complement their
            qualitative insights. Counselor notes are incorporated into the evaluation, and counselors
            can:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>- Track student profile development over time</li>
            <li>- Add contextual notes that inform AI evaluation</li>
            <li>- Export standardized summaries for applications</li>
            <li>- Compare students on consistent criteria</li>
          </ul>
        </Card>

        {/* CTA */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg">Create Account</Button>
            </Link>
            <Link to="/">
              <Button variant="secondary" size="lg">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
