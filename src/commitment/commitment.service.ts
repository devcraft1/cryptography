import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class CommitmentService {
  commit(value: string) {
    const nonce = randomBytes(32).toString('hex');
    const commitment = createHash('sha256')
      .update(value + nonce)
      .digest('hex');

    return { commitment, nonce };
  }

  verify(value: string, nonce: string, commitment: string) {
    const recomputed = createHash('sha256')
      .update(value + nonce)
      .digest('hex');

    const isValid = recomputed === commitment;

    return { isValid, value, commitment };
  }

  demonstrateCoinFlip() {
    // Step 1: Alice commits to "heads"
    const aliceValue = 'heads';
    const aliceCommit = this.commit(aliceValue);

    // Step 2: Bob commits to "tails"
    const bobValue = 'tails';
    const bobCommit = this.commit(bobValue);

    // Step 3: Both reveal their values
    const aliceReveal = {
      value: aliceValue,
      nonce: aliceCommit.nonce,
    };

    const bobReveal = {
      value: bobValue,
      nonce: bobCommit.nonce,
    };

    // Step 4: Verify both commitments
    const aliceVerification = this.verify(
      aliceReveal.value,
      aliceReveal.nonce,
      aliceCommit.commitment,
    );

    const bobVerification = this.verify(
      bobReveal.value,
      bobReveal.nonce,
      bobCommit.commitment,
    );

    // Step 5: Determine winner
    const coinResult = Math.random() < 0.5 ? 'heads' : 'tails';
    const winner = coinResult === aliceReveal.value ? 'Alice' : 'Bob';

    return {
      description: 'Fair coin flip using commitment schemes',
      steps: {
        step1_aliceCommits: {
          action: 'Alice commits to her choice without revealing it',
          commitment: aliceCommit.commitment,
        },
        step2_bobCommits: {
          action: 'Bob commits to his choice without revealing it',
          commitment: bobCommit.commitment,
        },
        step3_reveal: {
          action: 'Both reveal their values and nonces',
          alice: aliceReveal,
          bob: bobReveal,
        },
        step4_verify: {
          action: 'Verify both commitments match revealed values',
          aliceValid: aliceVerification.isValid,
          bobValid: bobVerification.isValid,
        },
        step5_result: {
          coinResult,
          winner,
        },
      },
      keyPoint:
        'Neither party can change their choice after committing, ensuring fairness',
    };
  }

  demonstrateAuction() {
    // Step 1: Three bidders commit to different bid amounts
    const bidder1Value = '150';
    const bidder2Value = '275';
    const bidder3Value = '200';
    const bidder1Commit = this.commit(bidder1Value);
    const bidder2Commit = this.commit(bidder2Value);
    const bidder3Commit = this.commit(bidder3Value);

    // Step 2: All reveal their bids
    const bidder1Reveal = {
      value: bidder1Value,
      nonce: bidder1Commit.nonce,
    };

    const bidder2Reveal = {
      value: bidder2Value,
      nonce: bidder2Commit.nonce,
    };

    const bidder3Reveal = {
      value: bidder3Value,
      nonce: bidder3Commit.nonce,
    };

    // Step 3: Verify all commitments
    const bidder1Verification = this.verify(
      bidder1Reveal.value,
      bidder1Reveal.nonce,
      bidder1Commit.commitment,
    );

    const bidder2Verification = this.verify(
      bidder2Reveal.value,
      bidder2Reveal.nonce,
      bidder2Commit.commitment,
    );

    const bidder3Verification = this.verify(
      bidder3Reveal.value,
      bidder3Reveal.nonce,
      bidder3Commit.commitment,
    );

    // Step 4: Determine winner (highest valid bid)
    const validBids = [
      {
        bidder: 'Bidder 1',
        amount: parseInt(bidder1Reveal.value),
        valid: bidder1Verification.isValid,
      },
      {
        bidder: 'Bidder 2',
        amount: parseInt(bidder2Reveal.value),
        valid: bidder2Verification.isValid,
      },
      {
        bidder: 'Bidder 3',
        amount: parseInt(bidder3Reveal.value),
        valid: bidder3Verification.isValid,
      },
    ].filter((b) => b.valid);

    validBids.sort((a, b) => b.amount - a.amount);
    const winner = validBids[0];

    return {
      description: 'Sealed-bid auction using commitment schemes',
      steps: {
        step1_commitments: {
          action: 'All bidders submit sealed (committed) bids',
          bidder1: { commitment: bidder1Commit.commitment },
          bidder2: { commitment: bidder2Commit.commitment },
          bidder3: { commitment: bidder3Commit.commitment },
        },
        step2_reveal: {
          action: 'All bidders reveal their bids and nonces',
          bidder1: bidder1Reveal,
          bidder2: bidder2Reveal,
          bidder3: bidder3Reveal,
        },
        step3_verify: {
          action: 'Verify all commitments match revealed bids',
          bidder1Valid: bidder1Verification.isValid,
          bidder2Valid: bidder2Verification.isValid,
          bidder3Valid: bidder3Verification.isValid,
        },
        step4_result: {
          action: 'Determine winner (highest valid bid)',
          winner: winner.bidder,
          winningBid: winner.amount,
          allBids: validBids,
        },
      },
      keyPoint:
        "No bidder can see others' bids before committing, preventing bid manipulation",
    };
  }

  demonstrate() {
    const coinFlip = this.demonstrateCoinFlip();
    const sealedBidAuction = this.demonstrateAuction();

    return {
      coinFlip,
      sealedBidAuction,
      description:
        'Commitment schemes allow a party to commit to a value while keeping it hidden, then reveal it later. Uses: fair coin flips, sealed-bid auctions, voting protocols.',
    };
  }
}
