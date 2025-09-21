use anchor_lang::prelude::*;

declare_id!("EWDGViEZrieLvQ544usdPVLazkaUdaVhBPAqoEG3HA7b");

#[program]
pub mod hashmeme {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn register_meme(
        ctx: Context<RegisterMeme>,
        meme_hash: [u8; 32],
        image_hash: [u8; 32],
        text_hash: [u8; 32],
        verdict: String,
        canon_score: u32,
        pumpfun_ca: String,
        metadata_uri: String,
    ) -> Result<()> {
        let meme = &mut ctx.accounts.meme;
        meme.meme_hash = meme_hash;
        meme.image_hash = image_hash;
        meme.text_hash = text_hash;
        meme.verdict = verdict;
        meme.canon_score = canon_score;
        meme.pumpfun_ca = pumpfun_ca;
        meme.metadata_uri = metadata_uri;
        meme.bump = ctx.bumps.meme;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
#[instruction(meme_hash: [u8; 32])]
pub struct RegisterMeme<'info> {
    #[account(
        init,
        payer = submitter,
        space = 8 + 32 + 32 + 32 + 4 + 4 + 4 + 1 + 100 + 100,
        seeds = [b"meme", meme_hash.as_slice()],
        bump
    )]
    pub meme: Account<'info, MemeCanon>,
    #[account(mut)]
    pub submitter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct MemeCanon {
    pub meme_hash: [u8; 32],
    pub image_hash: [u8; 32],
    pub text_hash: [u8; 32],
    pub verdict: String,
    pub canon_score: u32,
    pub pumpfun_ca: String,
    pub metadata_uri: String,
    pub bump: u8,
}
