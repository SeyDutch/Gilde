﻿using System;

namespace Orchard.Caching.Services {
    public interface ICacheService : IDependency {
        object GetObject<T>(string key);

        void Put<T>(string key, T value);
        void Put<T>(string key, T value, TimeSpan validFor);

        void Remove(string key);
        void Clear();
    }
}