"use client";

import Link from "next/link";
import { FiGlobe, FiLock, FiUsers, FiZap } from "react-icons/fi";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#EB83EA] to-[#7c3aed] bg-clip-text text-transparent">
          Technology & Ethics
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Building a more open, decentralized, and creator-owned future for drag content
        </p>
      </div>

      {/* Our Mission */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
        <p className="text-lg text-gray-300 mb-4 leading-relaxed">
          Dragverse exists to empower drag artists with technology that puts them first. We believe
          in a future where creators own their content, control their revenue, and connect directly
          with their community—without relying on traditional media conglomerates or platforms that
          take the majority of earnings.
        </p>
        <p className="text-lg text-gray-300 leading-relaxed">
          By leveraging emerging technologies like cryptocurrency and AI, we're building tools that
          promote open-source collaboration, decentralized ownership, and transparent, ethical
          practices.
        </p>
      </section>

      {/* How We Use Technology */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-white">How We Use Technology</h2>

        <div className="grid gap-8">
          {/* Crypto */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-r from-[#EB83EA] to-[#7c3aed] rounded-xl">
                <FiZap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4 text-white">Cryptocurrency</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  We use cryptocurrency (specifically on Base Network, an Ethereum Layer 2) to enable
                  <strong className="text-white"> direct creator payments</strong> without middlemen.
                  When fans tip creators, 100% of the funds go straight to the artist's wallet—no
                  platform fees, no delays, no gatekeepers.
                </p>
                <div className="bg-black/30 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-white mb-2">Why we chose this approach:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• <strong className="text-white">Low fees:</strong> ~$0.01 per transaction vs. 30% on traditional platforms</li>
                    <li>• <strong className="text-white">Instant payments:</strong> Creators receive funds in 2 seconds, not 30 days</li>
                    <li>• <strong className="text-white">Global access:</strong> Works for creators anywhere in the world</li>
                    <li>• <strong className="text-white">True ownership:</strong> You control your wallet, not us</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-400 italic">
                  We also support traditional payment methods (Stripe) for fans who prefer credit/debit
                  cards, ensuring accessibility for everyone.
                </p>
              </div>
            </div>
          </div>

          {/* AI */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-r from-[#EB83EA] to-[#7c3aed] rounded-xl">
                <FiGlobe className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Artificial Intelligence (Responsible Use)
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  We use AI to <strong className="text-white">enhance</strong> the creator experience,
                  not replace human creativity. AI helps with technical tasks that would otherwise
                  require expensive equipment or software.
                </p>
                <div className="bg-black/30 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-white mb-2">How we use AI ethically:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• <strong className="text-white">Video transcoding:</strong> Automatically optimize videos for all devices (720p, 480p, 360p)</li>
                    <li>• <strong className="text-white">Thumbnail generation:</strong> Suggest cover images from key moments</li>
                    <li>• <strong className="text-white">Content moderation:</strong> Flag harmful content while respecting artistic expression</li>
                    <li>• <strong className="text-white">Search & discovery:</strong> Help fans find creators they'll love</li>
                  </ul>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-red-300 mb-2">What we DON'T do with AI:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>✗ Generate fake content or deepfakes</li>
                    <li>✗ Train AI models on creator content without permission</li>
                    <li>✗ Sell creator data to third parties</li>
                    <li>✗ Replace human moderators with fully automated systems</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Decentralization */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-r from-[#EB83EA] to-[#7c3aed] rounded-xl">
                <FiLock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4 text-white">Decentralized Storage</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  Video files are stored on <strong className="text-white">Livepeer</strong> (a
                  decentralized video network) and metadata is stored on{" "}
                  <strong className="text-white">Ceramic</strong> (a decentralized data network). This
                  means:
                </p>
                <ul className="space-y-2 text-gray-300 mb-4">
                  <li>• Your content isn't controlled by a single company</li>
                  <li>• Videos remain accessible even if Dragverse goes offline</li>
                  <li>• You can migrate your content to other platforms if you choose</li>
                  <li>• No single entity can censor or delete your work arbitrarily</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Open Source */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-r from-[#EB83EA] to-[#7c3aed] rounded-xl">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4 text-white">Open Source & Collaboration</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  Dragverse is built on open-source technologies and we believe in transparency. Our
                  code is available for review, and we welcome contributions from the community.
                </p>
                <div className="bg-black/30 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">This means:</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Anyone can verify how we handle data and payments</li>
                    <li>• Developers can build compatible tools and integrations</li>
                    <li>• The community can propose and vote on new features</li>
                    <li>• If Dragverse ever shuts down, the code lives on</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitments */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-white">Our Commitments</h2>
        <div className="bg-gradient-to-r from-[#EB83EA]/10 to-[#7c3aed]/10 border border-[#EB83EA]/30 rounded-2xl p-8">
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-[#EB83EA] text-xl">✓</span>
              <span><strong className="text-white">Creator-first economics:</strong> Technology should empower artists, not exploit them</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#EB83EA] text-xl">✓</span>
              <span><strong className="text-white">Transparency:</strong> Open about how we use technology and where money flows</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#EB83EA] text-xl">✓</span>
              <span><strong className="text-white">Data privacy:</strong> We don't sell your data or train AI on your content without consent</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#EB83EA] text-xl">✓</span>
              <span><strong className="text-white">Accessibility:</strong> Support both crypto AND traditional payment methods</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#EB83EA] text-xl">✓</span>
              <span><strong className="text-white">Community governance:</strong> Creators have a voice in how the platform evolves</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Questions */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-white">Questions?</h2>
        <p className="text-gray-300 mb-6">
          We're committed to being transparent about how we build and operate Dragverse. If you have
          questions about our technology choices, data handling, or anything else, we'd love to hear
          from you.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-[#EB83EA] to-[#7c3aed] hover:from-[#E748E6] hover:to-[#6b2fd5] text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
          >
            Back to Home
          </Link>
          <a
            href="https://github.com/Dragverse"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold rounded-full transition-all"
          >
            View on GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
