int inv[maxn];
void getinv()
{
    int i;
    inv[1]=1;
    tr(i,2,n) inv[i]=1LL*(p-p/i)*inv[p%i]%p;
}