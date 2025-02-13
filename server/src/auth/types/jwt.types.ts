export interface JwtPayload {
  sub: number;
  email: string;
}

export interface JwtPayloadWithRt extends JwtPayload {
  refreshToken: string;
} 