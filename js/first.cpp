#include <algorithm>
#include <cstdio>
#include <iostream>
#include <unordered_set>
#include <map>
#include <set>
#include <vector>
using namespace std;

int T, N, tmp;
vector<int> array;
//slow solution
int sum(int from, int to){
	int sol = 0;
	for (int i = from; i < to; ++i)
	{
		sol+=array[i];
	}
	return sol;
}

int bin_search(int from, int to, int N){
	int left = 0;
	int right = N;
	int mid;
	while(left<right){
		
	}
}

int main(){
	cin >> T;
	while(T--){
		cin >> N;
		for (int i = 0; i < N; ++i)
		{
			cin >> tmp;
			array.push_back(tmp);
		}

	}
	return 0;
}